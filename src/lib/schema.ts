import { z } from "zod";

// User role schema
export const userRoleSchema = z.enum(["manufacturer", "product_owner"]);

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: userRoleSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  profile_picture: z.string().url(),
  manufacturer_code: z.string().nullable(),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Registration schema
export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: userRoleSchema,
});

// Product schema
export const productSchema = z.object({
  id: z.number(),
  product_id: z.string().uuid("Invalid UUID format"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  manufacturer_id: z.number(),
  created_at: z.string().datetime("Invalid ISO 8601 format"),
});

// Export types
export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type Product = z.infer<typeof productSchema>;
