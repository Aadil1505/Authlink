"use server";
import { db } from "../db";
import { Product } from "../schema";

export async function getProductById(prodId: string, manufactorerCode: string) {
  const query = `
  SELECT id, product_id, name, description, manufacturer_id, created_at 
  FROM products 
  WHERE product_id = $1 AND manufacturer_id = $2;
  `;

  try {
    const values = [prodId, manufactorerCode];
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

export async function getAllProducts(manufactorerCode: string) {
  try {
    console.log("Fetching products for manufacturer code:", manufactorerCode);

    // First get the manufacturer ID from the code
    const manufacturerQuery = `
      SELECT id FROM users 
      WHERE manufacturer_code = $1 
      AND role = 'manufacturer';
    `;

    const manufacturerResult = await db.query(manufacturerQuery, [
      manufactorerCode,
    ]);

    if (manufacturerResult.rows.length === 0) {
      console.log("No manufacturer found with code:", manufactorerCode);
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

    console.log("Executing query:", query);
    console.log("With manufacturer ID:", manufacturerId);

    const result = await db.query(query, [manufacturerId]);

    console.log("Query result:", result.rows);

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

export async function registerProduct(
  manufactorerCode: string,
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
      manufactorerCode,
    ]);

    if (manufacturerResult.rows.length === 0) {
      console.log("No manufacturer found with code:", manufactorerCode);
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
