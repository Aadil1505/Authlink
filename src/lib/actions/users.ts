"use server"

import { UserProfile } from "@/types";
import { db } from "../db";
import { hashPassword } from "./auth";

// RETRIEVES THE USER'S INFORMATION FROM THE DATABASE
export async function getUserFromDb(identifier: string) {
  const query = `
    SELECT * FROM users
    WHERE (email = $1)
  `;

  try {
    const result = await db.query(query, [identifier]);
    
    if (result.rows.length === 0) {
      console.log("No user found for identifier:", identifier);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    return null;
  }
}

export async function generateMakerIDNum(firstName: string, lastName: string) {
  // Return early if firstName or lastName is empty/invalid
  if (!firstName || !lastName || firstName.length === 0 || lastName.length === 0) {
      console.error('Invalid first name or last name');
      return 1; // Default to 1 if invalid input
  }

  const firstInitial = firstName[0].toLowerCase();
  const lastInitial = lastName[0].toLowerCase();

  let query = `
    SELECT COUNT(*) as count
    FROM users 
    WHERE LOWER(LEFT(first_name, 1)) = $1 AND LOWER(LEFT(last_name, 1)) = $2
    `;

  try {
      const result = await db.query(query, [firstInitial, lastInitial]);
      // Add 1 to the count to start from 1 instead of 0
      return parseInt(result.rows[0].count) + 1;
  } 
  catch (error) {
      console.error('Error getting makerID number:', error);
      return 1; // Default to 1 if query fails
  }
}

// Create full makerID
export async function generateMakerID(firstName: string, lastName: string) {
  const num = await generateMakerIDNum(firstName, lastName);
  // If num is undefined (shouldn't happen with above changes), default to 1
  const idNumber = num || 1;
  const firstInitial = firstName[0]?.toLowerCase() || 'x';
  const lastInitial = lastName[0]?.toLowerCase() || 'x';
  
  return `${firstInitial}${lastInitial}${idNumber.toString().padStart(2, '0')}`;
}

// Upload image to locally hosted image server
export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:3005/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Add a new student to the database
export async function addStudent(formData: FormData) {
  console.log("in add student")
  const query = `
    INSERT INTO users (
      first_name, last_name, h700, maker_id, major, email,
      role, profile_picture
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) RETURNING id;
  `;

  try {
    // Handle image upload first
    const profileImage = formData.get("profileImage") as File;
    let imageUrl = null;
    
    if (profileImage) {
      imageUrl = await uploadImage(profileImage);
    }

    const values = [
      formData.get("firstName"),
      formData.get("lastName"),
      formData.get("h700"),
      formData.get("makerId"),
      formData.get("major"),
      formData.get("email"),
      'student',
      imageUrl  
    ];

    const result = await db.query(query, values);
    console.log('Student inserted successfully:', result.rows[0]);
    return { success: true, userId: result.rows[0].id };
  } catch (error) {
    console.error('Error inserting student:', error);
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Add a new employee to the database
export async function addEmployee(formData: FormData) {
  const query = `
    INSERT INTO users (
      first_name, last_name, h700, maker_id, major, email,
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
      formData.get("h700"),
      formData.get("makerId"),
      formData.get("major"),
      formData.get("email"),
      hashedPassword,
      'employee',
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


export async function getUsers(): Promise<UserProfile[]> {
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
  `

  try {
    const result = await db.query(query)

    if (result.rows.length === 0) {
      console.log("No users found in database")
      return []
    }

    return result.rows
  } catch (error) {
    console.error("Error retrieving users from database:", error)
    return []
  }
}