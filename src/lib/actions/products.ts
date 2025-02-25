"use server";
import { db } from "../db";

export async function getProductById(prodId: string, manufactorerCode: string) {
  const query = `
  SELECT * FROM products 
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
    console.error("Error retrieving user from database:", error);
    return null;
  }
}
export async function getAllProducts(manufactorerCode: string) {
  const query = `
  SELECT * FROM products 
  WHERE manufacturer_id = $2;
  `;

  try {
    const result = await db.query(query, [manufactorerCode]);

    if (result.rows.length === 0) {
      console.log(
        "No products found for this manufactorer code: ",
        manufactorerCode
      );
      return null;
    }

    return result.rows;
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    return null;
  }
}
