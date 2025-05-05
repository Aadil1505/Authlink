"use server";
import { db } from "../db";

export interface ProductDetails {
  id: number;
  product_id: string;
  name: string;
  description: string | null;
  manufacturer_id: number;
  image_url: string | null;
  price: number | null;
  category: string | null;
  specifications: any;
  manufacture_date: Date | null;
  created_at: Date;
}

export async function getProductDetails(
  productId: string
): Promise<{ product: ProductDetails | null; error?: string }> {
  try {
    const query = `
      SELECT p.*, u.manufacturer_code 
      FROM products p
      JOIN users u ON p.manufacturer_id = u.id
      WHERE p.product_id = $1;
    `;

    const result = await db.query(query, [productId]);

    if (result.rows.length === 0) {
      return { product: null, error: "Product not found" };
    }

    return { product: result.rows[0] };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return {
      product: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch product details",
    };
  }
}
