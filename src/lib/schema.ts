import * as z from "zod";

// Student form schema
export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  h700: z.string().regex(/^h\d{9}$/, "Invalid h700 number format"),
  email: z
    .string()
    .email("Invalid email address")
    .endsWith("pride.hofstra.edu", "Must be a Hofstra email"),
  makerId: z.string().min(4, "MakerID must be at least 4 characters"),
  major: z.string().min(1, "Major is required"),
  profileImage: z.object({
    file: z.instanceof(File),
    preview: z.string(),
  }),
});
export type StudentFormValues = z.infer<typeof studentSchema>;

// Employee form schema
export const productOwnerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .endsWith("pride.hofstra.edu", "Must be a Hofstra email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z.object({
    file: z.instanceof(File),
    preview: z.string(),
  }),
});
export type ProductOwnerFormValues = z.infer<typeof productOwnerSchema>;

// Sign in schema
export const signInSchema = z.object({
  username: z.string().min(4, {
    message: "Please enter a valid pride email, makerID or 700 number.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});
export type SignInFormValues = z.infer<typeof signInSchema>;

// Certification template form schema
export const certificationTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type CertificationTemplateFormValues = z.infer<
  typeof certificationTemplateSchema
>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  product_id: z.string().uuid("Invalid UUID format"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  manufacturer_id: z.number(),
  created_at: z.string().datetime("Invalid ISO 8601 format"),
});

export type Product = z.infer<typeof productSchema>;
