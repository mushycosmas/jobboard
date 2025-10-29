// File: src/pages/api/job/get.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { status = "all", employer_id } = req.query;

    // Convert employer_id from string to number if provided
    const employerIdNum = employer_id && employer_id !== "null" ? Number(employer_id) : null;

    // Base SQL query
    let query = `
      SELECT 
        j.*,
        e.company_name,
        e.logo,
        r.name AS region_name,
        c.name AS country_name,
        GROUP_CONCAT(DISTINCT jc.category_id) AS category_ids,
        GROUP_CONCAT(DISTINCT cat.industry_name) AS category_names,
        GROUP_CONCAT(DISTINCT js.skill_id) AS skill_ids,
        GROUP_CONCAT(DISTINCT s.skill_name) AS skill_names,
        GROUP_CONCAT(DISTINCT jcu.culture_id) AS culture_ids,
        GROUP_CONCAT(DISTINCT cu.name) AS culture_names
      FROM jobs j
      LEFT JOIN employers e ON j.employer_id = e.id
      LEFT JOIN regions r ON j.region_id = r.id
      LEFT JOIN countries c ON r.country_id = c.id
      LEFT JOIN job_categories jc ON j.id = jc.job_id
      LEFT JOIN industries cat ON jc.category_id = cat.id
      LEFT JOIN job_skills js ON j.id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.id
      LEFT JOIN job_cultures jcu ON j.id = jcu.job_id
      LEFT JOIN cultures cu ON jcu.culture_id = cu.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (employerIdNum) {
      query += " AND j.employer_id = ?";
      params.push(employerIdNum);
    }

    if (status === "active") {
      query += " AND j.expired_date > NOW()";
    } else if (status === "expired") {
      query += " AND j.expired_date < NOW()";
    }

    query += " GROUP BY j.id ORDER BY j.posting_date DESC LIMIT 20";

    // Execute query
    const [results] = await db.query(query, params);

    // Map results and split comma-separated fields
    const jobs = (results as any[]).map((job) => ({
      ...job,
      category_ids: job.category_ids ? job.category_ids.split(",") : [],
      category_names: job.category_names ? job.category_names.split(",") : [],
      skill_ids: job.skill_ids ? job.skill_ids.split(",") : [],
      skill_names: job.skill_names ? job.skill_names.split(",") : [],
      culture_ids: job.culture_ids ? job.culture_ids.split(",") : [],
      culture_names: job.culture_names ? job.culture_names.split(",") : [],
    }));

    return res.status(200).json({ jobs });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs", details: error.message });
  }
}
