import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Add manufacturer_code column if it doesn't exist
    await db.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'manufacturer_code'
        ) THEN
          ALTER TABLE users ADD COLUMN manufacturer_code VARCHAR(255);
        END IF;
      END $$;
    `);

    // Update existing manufacturer users with a code if they don't have one
    await db.query(`
      UPDATE users 
      SET manufacturer_code = CONCAT('MANU_', id)
      WHERE role = 'manufacturer' 
      AND manufacturer_code IS NULL;
    `);

    // Get updated manufacturer list
    const manufacturers = await db.query(`
      SELECT id, email, first_name, last_name, role, manufacturer_code
      FROM users
      WHERE role = 'manufacturer';
    `);

    return NextResponse.json({
      success: true,
      message: "Manufacturer codes setup completed",
      manufacturers: manufacturers.rows,
    });
  } catch (error) {
    console.error("Error setting up manufacturer codes:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error setting up manufacturer codes",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
