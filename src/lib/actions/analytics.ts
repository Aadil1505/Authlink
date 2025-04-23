"use server";

import { db } from "../db";

export interface AnalyticsOverview {
  totalProducts: number;
  verifiedProducts: number;
  fraudulentActivities: number;
  pendingCases: number;
}

export interface TransactionDetails {
  id: number;
  product_id: number;
  product_name: string;
  transaction_type: "verification" | "fraud_report";
  status: "pending" | "confirmed" | "rejected";
  reported_by: string;
  details: string;
  created_at: string;
  resolved_at: string | null;
}

// Overview statistics
export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  try {
    // Get total products count
    const productsQuery = await db.query(`
      SELECT COUNT(*) as total
      FROM products;
    `);

    // Get transaction statistics
    const statsQuery = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE transaction_type = 'verification' AND status = 'confirmed') as verified_products,
        COUNT(*) FILTER (WHERE transaction_type = 'fraud_report' AND status = 'confirmed') as confirmed_frauds,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_cases
      FROM transactions;
    `);

    const totalProducts = parseInt(productsQuery.rows[0].total) || 0;
    const stats = statsQuery.rows[0];

    return {
      totalProducts,
      verifiedProducts: parseInt(stats?.verified_products) || 0,
      fraudulentActivities: parseInt(stats?.confirmed_frauds) || 0,
      pendingCases: parseInt(stats?.pending_cases) || 0,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      totalProducts: 0,
      verifiedProducts: 0,
      fraudulentActivities: 0,
      pendingCases: 0,
    };
  }
}

// Get verification transactions
export async function getVerificationTransactions(
  limit: number = 10,
  offset: number = 0
): Promise<{ transactions: TransactionDetails[]; total: number }> {
  try {
    const query = await db.query(
      `
      SELECT 
        t.id,
        t.product_id,
        p.name as product_name,
        t.transaction_type,
        t.status,
        CONCAT(u.first_name, ' ', u.last_name) as reported_by,
        t.details,
        t.created_at,
        t.resolved_at
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      JOIN users u ON t.reported_by = u.id
      WHERE t.transaction_type = 'verification'
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const totalQuery = await db.query(
      `SELECT COUNT(*) as total FROM transactions WHERE transaction_type = 'verification'`
    );

    return {
      transactions: query.rows,
      total: parseInt(totalQuery.rows[0].total),
    };
  } catch (error) {
    console.error("Error fetching verification transactions:", error);
    return { transactions: [], total: 0 };
  }
}

// Get fraud report transactions
export async function getFraudTransactions(
  limit: number = 10,
  offset: number = 0
): Promise<{ transactions: TransactionDetails[]; total: number }> {
  try {
    const query = await db.query(
      `
      SELECT 
        t.id,
        t.product_id,
        p.name as product_name,
        t.transaction_type,
        t.status,
        CONCAT(u.first_name, ' ', u.last_name) as reported_by,
        t.details,
        t.created_at,
        t.resolved_at
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      JOIN users u ON t.reported_by = u.id
      WHERE t.transaction_type = 'fraud_report'
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const totalQuery = await db.query(
      `SELECT COUNT(*) as total FROM transactions WHERE transaction_type = 'fraud_report'`
    );

    return {
      transactions: query.rows,
      total: parseInt(totalQuery.rows[0].total),
    };
  } catch (error) {
    console.error("Error fetching fraud transactions:", error);
    return { transactions: [], total: 0 };
  }
}

// Get all reports (both verifications and fraud)
export async function getAllReports(
  limit: number = 10,
  offset: number = 0
): Promise<{ transactions: TransactionDetails[]; total: number }> {
  try {
    const query = await db.query(
      `
      SELECT 
        t.id,
        t.product_id,
        p.name as product_name,
        t.transaction_type,
        t.status,
        CONCAT(u.first_name, ' ', u.last_name) as reported_by,
        t.details,
        t.created_at,
        t.resolved_at
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      JOIN users u ON t.reported_by = u.id
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const totalQuery = await db.query(
      `SELECT COUNT(*) as total FROM transactions`
    );

    return {
      transactions: query.rows,
      total: parseInt(totalQuery.rows[0].total),
    };
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return { transactions: [], total: 0 };
  }
}
