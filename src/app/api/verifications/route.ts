import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query to get verifications with product names, ordered by most recent first
    const query = `
      SELECT 
        uv.id,
        uv.user_id,
        uv.product_id,
        p.name as product_name,
        uv.verified_at
      FROM user_verifications uv
      JOIN products p ON p.product_id = uv.product_id
      ORDER BY uv.verified_at DESC
    `;

    const result = await db.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
} 