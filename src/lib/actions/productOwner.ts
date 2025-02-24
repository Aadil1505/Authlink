"use server"

import { db } from "../db";
import { hashPassword } from "./auth";
import { uploadImage } from "./users";

// Add a new product owner to the database
export async function addProductOwner(formData: FormData) {
  const query = `
    INSERT INTO users (
      first_name, last_name, email,
      password_hash, role, profile_picture
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING id;
  `;

  try {
    const password = formData.get("password") as string;
    const hashedPassword = await hashPassword(password);

    // Handle image upload first
    const profileImage = formData.get("profileImage") as File;
    let imageUrl = null;
    
    if (profileImage) {
      imageUrl = await uploadImage(profileImage);
    }

    const values = [
      formData.get("firstName"),
      formData.get("lastName"),
      formData.get("email"),
      hashedPassword,
      'product_owner',
      imageUrl  
    ];

    const result = await db.query(query, values);
    console.log('Employee inserted successfully:', result.rows[0]);
    return { success: true, userId: result.rows[0].id };
  } catch (error) {
    console.error('Error inserting employee:', error);
    return { error: "An unexpected error occurred. Please try again." }
  }
}