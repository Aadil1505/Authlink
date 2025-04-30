import { db } from "@/lib/db";

export async function getVerifications(userId: number) {
  try {
    const result = await db.query(
      `SELECT 
        t.id,
        p.name as product_name,
        t.created_at,
        t.status,
        t.details,
        t.evidence_url
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      WHERE t.transaction_type = 'verification'
      AND t.reported_by = $1
      ORDER BY t.created_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows,
    };
  } catch (error) {
    console.error("Error fetching verifications:", error);
    return {
      success: false,
      error: "Failed to fetch verifications",
    };
  }
}
