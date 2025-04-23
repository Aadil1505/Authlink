"use server";
import { db } from "../db";
import { Product } from "../schema";

export async function getProductById(prodId: string, manufacturerCode: string) {
  const query = `
  SELECT id, product_id, name, description, manufacturer_id, created_at 
  FROM products 
  WHERE product_id = $1 AND manufacturer_id = $2;
  `;

  try {
    const values = [prodId, manufacturerCode];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      console.log("No products found for this id: ", prodId);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving product from database:", error);
    return null;
  }
}

export async function getAllProducts(manufacturerCode: string) {
  try {
    console.log("Fetching products for manufacturer code:", manufacturerCode);

    // First get the manufacturer ID from the code
    const manufacturerQuery = `
      SELECT id FROM users 
      WHERE manufacturer_code = $1 
      AND role = 'manufacturer';
    `;

    const manufacturerResult = await db.query(manufacturerQuery, [
      manufacturerCode,
    ]);

    if (manufacturerResult.rows.length === 0) {
      console.log("No manufacturer found with code:", manufacturerCode);
      return null;
    }

    const manufacturerId = manufacturerResult.rows[0].id;

    // Then get the products for this manufacturer
    const query = `
      SELECT p.*, u.email as manufacturer_email
      FROM products p
      JOIN users u ON p.manufacturer_id = u.id
      WHERE p.manufacturer_id = $1
      ORDER BY p.created_at DESC
    `;

    const result = await db.query(query, [manufacturerId]);

    if (result.rows.length === 0) {
      console.log("No products found for manufacturer ID:", manufacturerId);
      return null;
    }

    return result.rows;
  } catch (error) {
    console.error("Error retrieving products from database:", error);
    return null;
  }
}

export async function registerManufacturerProduct(
  manufacturerCode: string,
  product: {
    name: string;
    description?: string;
  }
): Promise<Product | null> {
  try {
    // First get the manufacturer ID from the code
    const manufacturerQuery = `
      SELECT id FROM users 
      WHERE manufacturer_code = $1 
      AND role = 'manufacturer';
    `;

    const manufacturerResult = await db.query(manufacturerQuery, [
      manufacturerCode,
    ]);

    if (manufacturerResult.rows.length === 0) {
      console.log("No manufacturer found with code:", manufacturerCode);
      return null;
    }

    const manufacturerId = manufacturerResult.rows[0].id;

    const query = `
      INSERT INTO products (name, description, manufacturer_id)
      VALUES ($1, $2, $3)
      RETURNING id, product_id, name, description, manufacturer_id, created_at;
    `;

    const values = [product.name, product.description, manufacturerId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error registering product:", error);
    return null;
  }
}

// ============= Blockchain Verification Routes =============

interface NFCProductRegistration {
  nfcId: string;
  productId: string;
  name: string;
  description?: string;
}

interface NFCProductDetails {
  id: string;
  name: string;
  description?: string;
  nfcId: string;
  productId: string;
  created_at: Date;
  verified_count: number;
  status: "active" | "inactive";
}

// Health Check for Blockchain Service
export async function checkBlockchainHealth() {
  try {
    await db.query("SELECT NOW()");
    return { status: "healthy", timestamp: new Date() };
  } catch (error) {
    console.error("Health check failed:", error);
    throw new Error("Blockchain service connection failed");
  }
}

// Register Product with NFC Tag
export async function registerNFCProduct(data: NFCProductRegistration) {
  try {
    const query = `
      INSERT INTO nfc_products (nfc_id, product_id, name, description, status)
      VALUES ($1, $2, $3, $4, 'active')
      RETURNING *
    `;
    const result = await db.query(query, [
      data.nfcId,
      data.productId,
      data.name,
      data.description,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error registering NFC product:", error);
    throw new Error("Failed to register product with NFC tag");
  }
}

// Verify Product by NFC ID
export async function verifyNFCProduct(nfcId: string) {
  try {
    // First check if product exists
    const checkQuery = `
      SELECT * FROM nfc_products WHERE nfc_id = $1 AND status = 'active'
    `;
    const product = await db.query(checkQuery, [nfcId]);

    if (product.rows.length === 0) {
      throw new Error("Product not found or inactive");
    }

    // Record verification attempt
    const verifyQuery = `
      INSERT INTO nfc_verifications (product_id, verified_at)
      VALUES ($1, NOW())
      RETURNING *
    `;
    await db.query(verifyQuery, [product.rows[0].id]);

    return {
      verified: true,
      product: product.rows[0],
    };
  } catch (error) {
    console.error("Error verifying NFC product:", error);
    throw error;
  }
}

// Get NFC Product Details
export async function getNFCProductDetails(
  nfcId: string
): Promise<NFCProductDetails | null> {
  try {
    const query = `
      SELECT 
        p.*,
        COUNT(v.id) as verified_count
      FROM nfc_products p
      LEFT JOIN nfc_verifications v ON v.product_id = p.id
      WHERE p.nfc_id = $1
      GROUP BY p.id
    `;
    const result = await db.query(query, [nfcId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error getting NFC product details:", error);
    throw new Error("Failed to get product details");
  }
}

// List All NFC Products
export async function getAllNFCProducts() {
  try {
    const query = `
      SELECT 
        p.*,
        COUNT(v.id) as verified_count
      FROM nfc_products p
      LEFT JOIN nfc_verifications v ON v.product_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error listing NFC products:", error);
    throw new Error("Failed to list products");
  }
}
