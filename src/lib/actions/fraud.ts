import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.query("SELECT * FROM fraud_reports ORDER BY reported_at DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching fraud reports:", error);
    res.status(500).json({ error: "Failed to fetch fraud reports" });
  }
}

export type FraudMetric = {
  id: number;
  type: string;
  reported_at: string;
};

export async function getFraudMetrics(): Promise<FraudMetric[]> {
  try {
    const result = await db.query(`
      SELECT 
        id,
        type,
        reported_at
      FROM fraud_reports
      ORDER BY reported_at DESC
      LIMIT 30
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Error fetching fraud metrics:", error);
    throw new Error("Failed to fetch fraud metrics");
  }
}