import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all manufacturer users
    const manufacturers = await db.query(`
      SELECT id, email, first_name, last_name, role, manufacturer_code
      FROM users
      WHERE role = 'manufacturer';
    `);

    return NextResponse.json({
      success: true,
      message: "Retrieved manufacturer users",
      manufacturers: manufacturers.rows,
    });
  } catch (error) {
    console.error("Error checking manufacturer users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking manufacturer users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
