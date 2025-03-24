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
  const query = `
  SELECT id, product_id, name, description, manufacturer_id, created_at 
  FROM products 
  WHERE manufacturer_id = $1;
  `;

  try {
    const result = await db.query(query, [manufactorerCode]);

    if (result.rows.length === 0) {
      console.log(
        "No products found for this manufacturer code: ",
        manufactorerCode
      );
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
  product: Omit<Product, "id" | "created_at" | "product_id">
): Promise<Product | null> {
  const query = `
  INSERT INTO products (name, description, manufacturer_id)
  VALUES ($1, $2, $3)
  RETURNING id, product_id, name, description, manufacturer_id, created_at;
  `;

  try {
    const values = [product.name, product.description, manufactorerCode];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error registering product:", error);
    return null;
  }
}
