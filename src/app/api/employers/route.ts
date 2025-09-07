import { db } from '@/lib/db';  // Adjust this path to your actual DB client
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `
      SELECT
        id,
        company_name,
        logo
      FROM employers
      WHERE is_featured = 1
      ORDER BY created_at DESC;
    `;

    const [results] = await db.query(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching employers:', error);
    return NextResponse.json({ error: 'Failed to fetch employers' }, { status: 500 });
  }
}
