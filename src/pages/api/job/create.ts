// File: src/pages/api/jobs/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

// Utility to generate slug
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")          // Replace spaces with -
    .replace(/[^\w\-]+/g, "")      // Remove all non-word chars
    .replace(/\-\-+/g, "-");       // Replace multiple - with single -
};

// Generate unique slug by checking the DB
const generateUniqueSlug = async (baseSlug: string) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const [rows] = await db.query("SELECT id FROM jobs WHERE slug = ?", [slug]);
    if ((rows as any).length === 0) break; // slug is unique
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      employer_id,
      title,
      region_id,
      address,
      salary_from,
      salary_to,
      skill_ids = [],
      type_ids = [],
      category_ids = [],
      culture_ids = [],
      summary,
      description,
      posting_date,
      expired_date,
      experience_id,
      position_level_id,
      gender,
      applyOnline,
      url,
      emailAddress,
      jobAutoRenew,
    } = req.body;

    if (!employer_id || !title) {
      return res.status(400).json({ error: "Employer ID and title are required" });
    }

    // Fetch employer company name
    const [employerRows] = await db.query(
      "SELECT company_name FROM employers WHERE id = ?",
      [employer_id]
    );
    const company_name = (employerRows as any)[0]?.company_name;
    if (!company_name) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // Fetch region and country name
    let regionName = "";
    let countryName = "";
    if (region_id) {
      const [regionRows] = await db.query(
        `SELECT r.name AS region_name, c.name AS country_name
         FROM regions r
         LEFT JOIN countries c ON r.country_id = c.id
         WHERE r.id = ?`,
        [region_id]
      );

      const regionData = (regionRows as any)[0];
      if (regionData) {
        regionName = regionData.region_name || "";
        countryName = regionData.country_name || "";
      }
    }

    // Generate unique slug combining title + company_name + region + country
    const baseSlug = generateSlug([title, company_name, regionName, countryName].filter(Boolean).join(" "));
    const slug = await generateUniqueSlug(baseSlug);

    // Insert into jobs table
    const [result] = await db.query(
      `INSERT INTO jobs 
        (employer_id, title, region_id, address, salary_from, salary_to, summary, description, posting_date, expired_date, experience_id, position_level_id, gender, applyOnline, url, emailAddress, jobAutoRenew, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employer_id,
        title,
        region_id || null,
        address || null,
        salary_from || null,
        salary_to || null,
        summary || null,
        description || null,
        posting_date ? new Date(posting_date) : null,
        expired_date ? new Date(expired_date) : null,
        experience_id || null,
        position_level_id || null,
        gender || null,
        applyOnline ? 1 : 0,
        url || null,
        emailAddress || null,
        jobAutoRenew ? 1 : 0,
        slug,
      ]
    );

    const jobId = (result as any).insertId;

    // Helper function for many-to-many inserts
    const insertManyToMany = async (table: string, column: string, ids: any[]) => {
      if (!ids.length) return;
      const values = ids.map(() => "(?, ?)").join(", ");
      const params: any[] = ids.flatMap(id => [jobId, id]);
      await db.query(`INSERT INTO ${table} (job_id, ${column}) VALUES ${values}`, params);
    };

    // Insert relations safely
    await insertManyToMany("job_skills", "skill_id", skill_ids);
    await insertManyToMany("job_types", "type_id", type_ids);
    await insertManyToMany("job_categories", "category_id", category_ids);
    await insertManyToMany("job_cultures", "culture_id", culture_ids);

    return res.status(201).json({ message: "Job created successfully", jobId, slug });
  } catch (error: any) {
    console.error("Job creation error:", error);
    return res.status(500).json({ error: "Failed to create job", details: error.message });
  }
}
