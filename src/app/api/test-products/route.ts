import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if table exists
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Products table does not exist",
          error: "Table not found",
        },
        { status: 404 }
      );
    }

    // Get table structure
    const structure = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products';
    `);

    // Get sample data
    const sampleData = await db.query(`
      SELECT * FROM products LIMIT 5;
    `);

    return NextResponse.json({
      success: true,
      message: "Products table exists",
      structure: structure.rows,
      sampleData: sampleData.rows,
    });
  } catch (error) {
    console.error("Error checking products table:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking products table",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
