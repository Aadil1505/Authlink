"use server";

import { db } from "../db";

export interface NFCTagLocation {
  id: number;
  name: string;
  description: string;
  minimum_stock: number;
  available_tags: number;
  total_tags: number;
  stock_percentage: number;
}

export interface NFCTag {
  id: string;
  type: string;
  status: "available" | "assigned" | "testing" | "defective";
  last_tested: string;
  batch_number: string;
  product_name: string | null;
  location: string;
}

export interface NFCTagStats {
  totalTags: number;
  availableTags: number;
  inUseTags: number;
  lowStockLocations: number;
}

// Get NFC tag statistics
export async function getNFCTagStats(): Promise<NFCTagStats> {
  try {
    const result = await db.query(`
      WITH location_stats AS (
        SELECT 
          l.id,
          l.minimum_stock,
          COUNT(t.id) as tag_count
        FROM nfc_tag_locations l
        LEFT JOIN nfc_tags t ON l.id = t.location_id
        GROUP BY l.id, l.minimum_stock
      )
      SELECT
        (SELECT COUNT(*) FROM nfc_tags) as total_tags,
        (SELECT COUNT(*) FROM nfc_tags WHERE status = 'available') as available_tags,
        (SELECT COUNT(*) FROM nfc_tags WHERE status = 'assigned') as in_use_tags,
        (SELECT COUNT(*) 
         FROM location_stats 
         WHERE tag_count < minimum_stock) as low_stock_locations
    `);

    return {
      totalTags: parseInt(result.rows[0].total_tags) || 0,
      availableTags: parseInt(result.rows[0].available_tags) || 0,
      inUseTags: parseInt(result.rows[0].in_use_tags) || 0,
      lowStockLocations: parseInt(result.rows[0].low_stock_locations) || 0,
    };
  } catch (error) {
    console.error("Error fetching NFC tag stats:", error);
    return {
      totalTags: 0,
      availableTags: 0,
      inUseTags: 0,
      lowStockLocations: 0,
    };
  }
}

// Get location inventory status
export async function getLocationInventory(): Promise<NFCTagLocation[]> {
  try {
    const result = await db.query(`
      WITH location_stats AS (
        SELECT 
          location_id,
          COUNT(*) as total_tags,
          COUNT(*) FILTER (WHERE status = 'available') as available_tags
        FROM nfc_tags
        GROUP BY location_id
      )
      SELECT 
        l.id,
        l.name,
        l.description,
        l.minimum_stock,
        COALESCE(s.available_tags, 0) as available_tags,
        COALESCE(s.total_tags, 0) as total_tags,
        CASE 
          WHEN l.minimum_stock = 0 THEN 100
          ELSE ROUND(COALESCE(s.available_tags, 0)::numeric / l.minimum_stock * 100)
        END as stock_percentage
      FROM nfc_tag_locations l
      LEFT JOIN location_stats s ON l.id = s.location_id
      ORDER BY l.name;
    `);

    return result.rows;
  } catch (error) {
    console.error("Error fetching location inventory:", error);
    return [];
  }
}

// Get NFC tags with pagination and filters
export async function getNFCTags(
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<{ tags: NFCTag[]; total: number }> {
  try {
    let query = `
      SELECT 
        t.id,
        t.type,
        t.status,
        t.last_tested,
        t.batch_number,
        p.name as product_name,
        l.name as location
      FROM nfc_tags t
      LEFT JOIN products p ON t.product_id = p.id
      JOIN nfc_tag_locations l ON t.location_id = l.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (t.id ILIKE $${params.length} OR t.batch_number ILIKE $${params.length})`;
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM (${query}) as count_query`,
      params
    );

    // Add pagination
    query += ` ORDER BY t.id LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, (page - 1) * limit);

    const result = await db.query(query, params);

    return {
      tags: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    console.error("Error fetching NFC tags:", error);
    return { tags: [], total: 0 };
  }
}
