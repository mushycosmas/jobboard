import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const limit = searchParams.get('limit'); // Get the limit from the URL

  try {
    let query = `
      SELECT 
        jobs.*, 
        employers.company_name,
        employers.address,
        employers.logo,
        employers.employer_email,
        employers.phonenumber,
        employers.aboutCompany,
        employers.company_size,
        employers.website,
        employers.linkedin,
        employers.twitter,
        employers.facebook
      FROM jobs
      LEFT JOIN employers ON jobs.employer_id = employers.id
    `;

    const values: any[] = [];

    // Handle category filter
    if (categoryId) {
      query += ' WHERE FIND_IN_SET(?, jobs.category_ids)';
      values.push(categoryId);
    }

    // Add limit if provided and is a number
    if (limit && !isNaN(Number(limit))) {
      query += ' LIMIT ?';
      values.push(Number(limit));
    }

    const [rows] = await db.query(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
