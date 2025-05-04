import { db } from "@/lib/db";

export type VerificationMetric = {
  id: number;
  status: string;
  created_at: string;
};

export async function getVerificationMetrics(): Promise<VerificationMetric[]> {
  try {
    const result = await db.query(`
      SELECT 
        id,
        status,
        created_at
      FROM verifications
      ORDER BY created_at DESC
      LIMIT 30
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Error fetching verification metrics:", error);
    throw new Error("Failed to fetch verification metrics");
  }
}