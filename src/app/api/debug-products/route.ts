import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all products with their manufacturer information
    const products = await db.query(`
      SELECT p.*, u.email as manufacturer_email, u.manufacturer_code
      FROM products p
      LEFT JOIN users u ON p.manufacturer_id = u.id
      ORDER BY p.created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      message: "Debug information retrieved",
      products: products.rows,
      totalProducts: products.rows.length,
    });
  } catch (error) {
    console.error("Error retrieving debug information:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error retrieving debug information",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
