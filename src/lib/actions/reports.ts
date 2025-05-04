import { db } from "@/lib/db";

export type Report = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export async function getReports(): Promise<Report[]> {
  try {
    const result = await db.query(`
      SELECT 
        id,
        title,
        description,
        created_at
      FROM reports
      ORDER BY created_at DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports");
  }
}