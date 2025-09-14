// File: src/pages/api/job/delete/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db"; // your SQL client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    const jobId = Array.isArray(id) ? id[0] : id;

    // Delete relations first
    await db.query("DELETE FROM job_skills WHERE job_id = ?", [jobId]);
    await db.query("DELETE FROM job_types WHERE job_id = ?", [jobId]);
    await db.query("DELETE FROM job_categories WHERE job_id = ?", [jobId]);
    await db.query("DELETE FROM job_cultures WHERE job_id = ?", [jobId]);

    // Delete the job itself
    const result = await db.query("DELETE FROM jobs WHERE id = ?", [jobId]);

    // Check if a row was actually deleted
    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json({ message: "Job and related data deleted successfully" });
  } catch (error: any) {
    console.error("Delete job error:", error);
    return res.status(500).json({ error: "Failed to delete job", details: error.message });
  }
}
