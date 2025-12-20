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
        j.*,
        e.company_name,
        e.address,
        e.logo,
        e.employer_email,
        e.phonenumber,
        e.aboutCompany,
        e.company_size,
        e.website,
        e.linkedin,
        e.twitter,
        e.facebook,
        GROUP_CONCAT(DISTINCT jc.category_id) AS category_ids,
        GROUP_CONCAT(DISTINCT c.name) AS category_names,
        GROUP_CONCAT(DISTINCT c.slug) AS category_slugs
      FROM jobs j
      LEFT JOIN employers e ON j.employer_id = e.id
      LEFT JOIN job_categories jc ON j.id = jc.job_id
      LEFT JOIN categories c ON jc.category_id = c.id
      WHERE 1=1
    `;

    const values: any[] = [];

    if (categoryId) {
      query += " AND jc.category_id = ?";
      values.push(categoryId);
    }

    query += " GROUP BY j.id ORDER BY j.posting_date DESC";

    if (limit && !isNaN(Number(limit))) {
      query += " LIMIT ?";
      values.push(Number(limit));
    }

    const [rows] = await db.query(query, values);

    // Map category fields into arrays of objects
    const jobs = (rows as any[]).map((job) => {
      const ids = job.category_ids ? job.category_ids.split(',') : [];
      const names = job.category_names ? job.category_names.split(',') : [];
      const slugs = job.category_slugs ? job.category_slugs.split(',') : [];

      const categories = ids.map((id, i) => ({
        id: parseInt(id),
        name: names[i] || '',
        slug: slugs[i] || ''
      }));

      return { ...job, categories };
    });

    // Store in cache with expiration
    cache[cacheKey] = {
      data: jobs,
      expires: Date.now() + CACHE_DURATION,
    };

    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('Database error:', error.message || error);
    const responsePayload = process.env.NODE_ENV === 'development'
      ? { error: 'Internal server error', details: error.message }
      : { error: 'Internal server error' };

    return NextResponse.json(responsePayload, { status: 500 });
  }
}
