"use server";
import { db } from "../db";

export interface TemplateInput {
  name: string;
  description?: string;
  manufacturer_id: number;
  category?: string;
  features?: string[];
  specifications?: unknown;
  image_url?: string;
  price?: number;
}

export interface TemplateResponse {
  success: boolean;
  templateId?: number;
  error?: string;
}

export async function registerTemplate(
  input: TemplateInput
): Promise<TemplateResponse> {
  try {
    const result = await db.query(
      `INSERT INTO templates (name, description, manufacturer_id, category, features, specifications, image_url, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        input.name,
        input.description ?? null,
        input.manufacturer_id,
        input.category ?? null,
        input.features ?? null,
        input.specifications ?? null,
        input.image_url ?? null,
        input.price ?? null,
      ]
    );
    return { success: true, templateId: result.rows[0].id };
  } catch (error: unknown) {
    let errorMsg = "Failed to register template";
    if (error instanceof Error) errorMsg = error.message;
    return { success: false, error: errorMsg };
  }
}
