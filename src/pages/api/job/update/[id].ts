import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

// Helper to generate slug
const generateSlug = (title: string, jobId: string | number, region?: string) => {
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slugBase}-${jobId}${region ? `-${region.toLowerCase()}` : ""}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    const jobId = Array.isArray(id) ? id[0] : id;

    const {
      title,
      region_id,
      address,
      job_type_id, // <-- single value
      salary_from,
      salary_to,
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

    // Fetch region name for slug (optional)
    let regionName = "";
    if (region_id) {
      const [region] = await db.query("SELECT name FROM regions WHERE id = ?", [region_id]);
      if (Array.isArray(region) && region.length) regionName = region[0].name;
    }

    // Generate slug
    const slug = generateSlug(title || "job", jobId, regionName);

    // Update the main job data
    await db.query(
      `UPDATE jobs SET
        title = ?, slug = ?, region_id = ?, address = ?, job_type_id = ?, salary_from = ?, salary_to = ?, 
        summary = ?, description = ?, posting_date = ?, expired_date = ?, experience_id = ?, 
        position_level_id = ?, gender = ?, applyOnline = ?, url = ?, emailAddress = ?, jobAutoRenew = ?
      WHERE id = ?`,
      [
        title || null,
        slug,
        region_id || null,
        address || null,
        job_type_id || null, // <-- directly store single type
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
        jobId,
      ]
    );

    return res.status(200).json({ message: "Job updated successfully", jobId, slug });
  } catch (error: any) {
    console.error("Update job error:", error);
    return res.status(500).json({ error: "Failed to update job", details: error.message });
  }
}
