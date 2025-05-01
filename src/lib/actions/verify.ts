// 'use server'

type SuccessResponse = {
  uid: string;
  read_ctr: number;
  enc_mode: string;
};

export async function verifyTag(uid: string, ctr: string, cmac: string) {
  if (!uid || !ctr || !cmac) {
    return { error: "Missing required parameters (uid, ctr, or cmac)" };
  }

  try {
    const apiUrl = `${process.env.SDM_BACKEND}tagpt?uid=${uid}&ctr=${ctr}&cmac=${cmac}`;

    console.log("Calling API:", apiUrl);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if ("error" in data) {
      return { error: data.error };
    } else {
      return { result: data as SuccessResponse };
    }
  } catch (err: any) {
    const errorMessage = err.message || "An unknown error occurred";
    console.error("Error verifying tag:", err);
    return { error: errorMessage };
  }
}
// lib/actions/verify.ts

// 'use server'

// type SuccessResponse = {
//   uid: string;
//   read_ctr: number;
//   enc_mode: string;
//   file_data?: string;
//   tt_status?: string;
// }

// export async function verifyTag(picc_data: string, enc: string, cmac: string) {
//   try {
//     // Create the URL with the new parameter format
//     const apiUrl = `${process.env.SDM_BACKEND}tag?picc_data=${picc_data}&enc=${enc}&cmac=${cmac}`;
//     console.log("Calling API:", apiUrl);

//     const response = await fetch(
//       apiUrl,
//       {
//         cache: 'no-store',
//         headers: {
//           'Accept': 'application/json'
//         }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Error ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();

//     if ('error' in data) {
//       return { error: data.error };
//     } else {
//       return { result: data as SuccessResponse };
//     }
//   } catch (err: any) {
//     const errorMessage = err.message || "An unknown error occurred";
//     console.error("Error verifying tag:", err);
//     return { error: errorMessage };
//   }
// }

// lib/actions/product.ts

type ProductData = {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  manufactureDate: string;
  imageUrl: string;
  price: string;
  category: string;
  authenticity: "verified" | "unverified";
  features: string[];
  specifications: Record<string, string>;
};

import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export async function getProductByUid(
  uid: string
): Promise<{ product: ProductData | null; error?: string }> {
  try {
    // Check if the UID is a product ID (starts with PRD-)
    if (!uid.startsWith("PRD-")) {
      return { product: null, error: "Invalid product ID format" };
    }

    // Query the database directly
    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        manufacturer_id,
        created_at,
        product_id,
        category,
        features,
        specifications,
        image_url,
        price,
        manufacture_date
       FROM products 
       WHERE product_id = $1`,
      [uid]
    );

    if (result.rows.length === 0) {
      return { product: null, error: "Product not found" };
    }

    const data = result.rows[0];

    // Transform the database response to match our ProductData type
    const product: ProductData = {
      id: data.product_id,
      name: data.name,
      description: data.description,
      manufacturer: data.manufacturer_id,
      manufactureDate: data.manufacture_date,
      imageUrl: data.image_url,
      price: data.price,
      category: data.category,
      authenticity: "verified",
      features: data.features || [],
      specifications: data.specifications || {},
    };

    return { product };
  } catch (error: unknown) {
    console.error("Error fetching product:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch product information";
    return { product: null, error: errorMessage };
  }
}
