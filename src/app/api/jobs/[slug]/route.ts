// src/app/api/jobs/[slug]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  // ✅ Properly access the slug from context.params
  const slug = context.params.slug;

  try {
    const query = `
      SELECT 
        j.*, 
        e.company_name, 
        e.logo, 
        GROUP_CONCAT(DISTINCT jc.category_id) AS category_ids,
        GROUP_CONCAT(DISTINCT c.industry_name) AS category_names,
        GROUP_CONCAT(DISTINCT jcu.culture_id) AS culture_ids,
        GROUP_CONCAT(DISTINCT cu.culture_name) AS culture_names,
        GROUP_CONCAT(DISTINCT js.skill_id) AS skill_ids,
        GROUP_CONCAT(DISTINCT s.skill_name) AS skill_names
      FROM 
        jobs j
      LEFT JOIN 
        employers e ON j.employer_id = e.id
      LEFT JOIN 
        job_categories jc ON j.id = jc.job_id
      LEFT JOIN 
        industries c ON jc.category_id = c.id
      LEFT JOIN 
        job_cultures jcu ON j.id = jcu.job_id
      LEFT JOIN 
        cultures cu ON jcu.culture_id = cu.id
      LEFT JOIN 
        job_skills js ON j.id = js.job_id
      LEFT JOIN 
        skills s ON js.skill_id = s.id
      WHERE j.slug = ?
      GROUP BY j.id, e.company_name, e.logo
      LIMIT 1;
    `;

    const [rows] = await db.query(query, [slug]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const job = rows[0];
    const parseCSV = (str: string | null) => (str ? str.split(',') : []);

    job.category_ids = parseCSV(job.category_ids);
    job.category_names = parseCSV(job.category_names);
    job.culture_ids = parseCSV(job.culture_ids);
    job.culture_names = parseCSV(job.culture_names);
    job.skill_ids = parseCSV(job.skill_ids);
    job.skill_names = parseCSV(job.skill_names);

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job by slug:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
