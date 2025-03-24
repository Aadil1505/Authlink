import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all users with their roles and manufacturer codes
    const users = await db.query(`
      SELECT id, email, role, manufacturer_code, first_name, last_name
      FROM users
      ORDER BY id;
    `);

    // Get the current user's session info if available
    const currentUser = await db.query(`
      SELECT u.id, u.email, u.role, u.manufacturer_code
      FROM users u
      WHERE u.email = 'aadil.alli@example.com';
    `);

    return NextResponse.json({
      success: true,
      message: "Debug information retrieved",
      allUsers: users.rows,
      currentUser: currentUser.rows[0] || null,
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
