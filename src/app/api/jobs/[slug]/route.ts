import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/jobs/[slug]
 * Fetch a single job with full details by slug
 */
export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  // ✅ Next.js App Router requires awaiting params
  const { slug } = await context.params;

  try {
    /**
     * Main job query
     * - Includes employer, location, experience
     * - Aggregates categories, cultures, skills
     */
    const query = `
      SELECT 
        -- Job core
        j.*,

        -- Employer
        e.company_name,
        e.logo,

        -- Location
        r.id   AS region_id,
        r.name AS region_name,
        co.id  AS country_id,
        co.name AS country_name,

        -- Experience
        ex.name AS experience_name,

        -- Dates
        j.expired_date,

        -- Aggregated attributes
        GROUP_CONCAT(DISTINCT jc.category_id)      AS category_ids,
        GROUP_CONCAT(DISTINCT c.industry_name)     AS category_names,
        GROUP_CONCAT(DISTINCT jcu.culture_id)      AS culture_ids,
        GROUP_CONCAT(DISTINCT cu.name)             AS culture_names,
        GROUP_CONCAT(DISTINCT js.skill_id)         AS skill_ids,
        GROUP_CONCAT(DISTINCT s.skill_name)        AS skill_names

      FROM jobs j

      -- Employer
      LEFT JOIN employers e 
        ON j.employer_id = e.id

      -- Experience
      LEFT JOIN experiences ex 
        ON j.experience_id = ex.id

      -- Categories / Industries
      LEFT JOIN job_categories jc 
        ON j.id = jc.job_id
      LEFT JOIN industries c 
        ON jc.category_id = c.id

      -- Cultures
      LEFT JOIN job_cultures jcu 
        ON j.id = jcu.job_id
      LEFT JOIN cultures cu 
        ON jcu.culture_id = cu.id

      -- Skills
      LEFT JOIN job_skills js 
        ON j.id = js.job_id
      LEFT JOIN skills s 
        ON js.skill_id = s.id

      -- Location
      LEFT JOIN regions r 
        ON j.region_id = r.id
      LEFT JOIN countries co 
        ON r.country_id = co.id

      WHERE j.slug = ?
      GROUP BY 
        j.id,
        e.company_name,
        e.logo,
        r.id,
        r.name,
        co.id,
        co.name,
        ex.name
      LIMIT 1;
    `;

    const [rows]: any = await db.query(query, [slug]);

    // ❌ Not found
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    const job = rows[0];

    /**
     * Convert CSV fields to arrays
     */
    const parseCSV = (value: string | null) =>
      value ? value.split(',') : [];

    job.category_ids   = parseCSV(job.category_ids);
    job.category_names = parseCSV(job.category_names);
    job.culture_ids    = parseCSV(job.culture_ids);
    job.culture_names  = parseCSV(job.culture_names);
    job.skill_ids      = parseCSV(job.skill_ids);
    job.skill_names    = parseCSV(job.skill_names);

    // ✅ Success
    return NextResponse.json(job);

  } catch (error) {
    console.error('Error fetching job by slug:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
