import { db } from "@/lib/db";

export type OverviewMetric = {
  id: number;
  name: string;
  value: string;
};

export async function getOverviewMetrics(): Promise<OverviewMetric[]> {
  try {
    const result = await db.query(`
      SELECT 
        id,
        name,
        value
      FROM overview_metrics
      ORDER BY id ASC
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Error fetching overview metrics:", error);
    throw new Error("Failed to fetch overview metrics");
  }
}