import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get the 'limit' parameter from the URL searchParams, defaulting to 12 if not provided
  const limit = parseInt(searchParams.get('limit')) || 12;

  try {
    const query = `
      SELECT 
        i.id,
        i.creator_id,
        i.industry_name AS category, 
        i.slug AS slug,
        COUNT(j.id) AS job_count
      FROM industries i
      LEFT JOIN job_categories jc ON jc.category_id = i.id
      LEFT JOIN jobs j ON j.id = jc.job_id
      GROUP BY i.id
      ORDER BY job_count DESC
      LIMIT ?  -- Use dynamic limit
    `;

    // Execute the query with the dynamic limit
    const [results] = await db.query(query, [limit]);

    // Return JSON response using NextResponse
    return NextResponse.json(results);

  } catch (error) {
    // Log error for debugging
    console.error('Error fetching industries with job count:', error);

    // Return a 500 status code with an error message
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
