"use server";

import { User, UserRole } from "@/types";
import { db } from "../db";
import { hashPassword } from "./auth";

// Get user by email
export async function getUserFromDb(email: string): Promise<User | null> {
  const query = `
    SELECT 
      id,
      email,
      password_hash,
      first_name,
      last_name,
      role,
      created_at,
      updated_at,
      profile_picture,
      manufacturer_code
    FROM users
    WHERE email = $1
    AND role IN ('manufacturer', 'product_owner')
    AND password_hash IS NOT NULL;
  `;

  try {
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      console.log("No user found for email:", email);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    return null;
  }
}

// Create new user
export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole
): Promise<User | null> {
  const hashedPassword = await hashPassword(password);

  const query = `
    INSERT INTO users (
      email,
      password_hash,
      first_name,
      last_name,
      role,
      profile_picture,
      manufacturer_code
    )
    VALUES (
      $1, $2, $3, $4, $5,
      'https://placehold.co/1080x1920?text=Hello+World',
      CASE WHEN $5 = 'manufacturer' THEN NULL END
    )
    RETURNING 
      id,
      email,
      first_name,
      last_name,
      role,
      created_at,
      updated_at,
      profile_picture,
      manufacturer_code;
  `;

  try {
    const result = await db.query(query, [
      email,
      hashedPassword,
      firstName,
      lastName,
      role,
    ]);

    // If this is a manufacturer, update their manufacturer_code
    if (role === "manufacturer" && result.rows[0].id) {
      const updateQuery = `
        UPDATE users 
        SET manufacturer_code = CONCAT('MANU_', id::text)
        WHERE id = $1
        RETURNING 
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          updated_at,
          profile_picture,
          manufacturer_code;
      `;

      const updateResult = await db.query(updateQuery, [result.rows[0].id]);
      return updateResult.rows[0];
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: number,
  updates: Partial<
    Omit<User, "id" | "email" | "password_hash" | "role" | "manufacturer_code">
  >
): Promise<User | null> {
  const validFields = ["first_name", "last_name", "profile_picture"];

  const updates_filtered = Object.entries(updates)
    .filter(([key]) => validFields.includes(key))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  if (Object.keys(updates_filtered).length === 0) {
    return null;
  }

  const setClause = Object.keys(updates_filtered)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");

  const query = `
    UPDATE users
    SET ${setClause},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING 
      id,
      email,
      first_name,
      last_name,
      role,
      created_at,
      updated_at,
      profile_picture,
      manufacturer_code;
  `;

  try {
    const values = [userId, ...Object.values(updates_filtered)];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      console.log("No user found with ID:", userId);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}

// Upload image to locally hosted image server
export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:3005/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function getUsers(): Promise<User[]> {
  const query = `
    SELECT 
      id,
      maker_id,
      h700,
      email,
      first_name,
      last_name,
      role,
      major,
      created_at,
      updated_at,
      profile_picture
    FROM users
    ORDER BY id ASC;
  `;

  try {
    const result = await db.query(query);

    if (result.rows.length === 0) {
      console.log("No users found in database");
      return [];
    }

    return result.rows;
  } catch (error) {
    console.error("Error retrieving users from database:", error);
    return [];
  }
}
