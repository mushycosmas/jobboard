import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Simple in-memory cache
const cache: Record<string, { data: any; expires: number }> = {};
const CACHE_DURATION = 1000 * 60 * 2; // 2 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') || '';
  const limit = searchParams.get('limit') || '';

  // Generate a cache key based on request parameters
  const cacheKey = `jobs_${categoryId}_${limit}`;

  // Return cached response if available and not expired
  if (cache[cacheKey] && cache[cacheKey].expires > Date.now()) {
    return NextResponse.json(cache[cacheKey].data);
  }

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

    if (categoryId) {
      query += ' WHERE FIND_IN_SET(?, jobs.category_ids)';
      values.push(categoryId);
    }

    if (limit && !isNaN(Number(limit))) {
      query += ' LIMIT ?';
      values.push(Number(limit));
    }

    const [rows] = await db.query(query, values);

    // Store in cache with expiration
    cache[cacheKey] = {
      data: rows,
      expires: Date.now() + CACHE_DURATION,
    };

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database error:', error.message || error);
    const responsePayload = process.env.NODE_ENV === 'development'
      ? { error: 'Internal server error', details: error.message }
      : { error: 'Internal server error' };

    return NextResponse.json(responsePayload, { status: 500 });
  }
}
