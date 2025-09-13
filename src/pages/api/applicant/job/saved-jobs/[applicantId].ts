import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Applicant ID is required" });
  }

  const applicantIdNum = Number(applicantId);
  if (isNaN(applicantIdNum)) return res.status(400).json({ message: "Applicant ID must be a number" });

  try {
    // GET: fetch all saved jobs for the applicant
    if (req.method === "GET") {
      const [rows] = await db.query<RowDataPacket[]>(`
        SELECT sj.id, sj.job_id, sj.applicant_id,j.slug, j.title AS job_title, j.posting_date, j.expired_date
        FROM applicant_saved_jobs sj
        LEFT JOIN jobs j ON sj.job_id = j.id
        WHERE sj.applicant_id = ?;
      `, [applicantIdNum]);

      return res.status(200).json(rows);
    }

    // POST: add a saved job
    if (req.method === "POST") {
      const { job_id } = req.body;
      if (!job_id) return res.status(400).json({ message: "Job ID is required" });

      const [result] = await db.query<ResultSetHeader>(`
        INSERT INTO applicant_saved_jobs (applicant_id, job_id)
        VALUES (?, ?)
      `, [applicantIdNum, job_id]);

      return res.status(201).json({ message: "Job saved successfully", id: result.insertId });
    }

    // DELETE: remove a saved job
    if (req.method === "DELETE") {
      const idParam = req.query.id;
      const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);
      if (!id) return res.status(400).json({ message: "Saved Job ID is required for delete" });

      await db.query(`DELETE FROM applicant_saved_jobs WHERE id = ? AND applicant_id = ?`, [id, applicantIdNum]);
      return res.status(200).json({ message: "Saved job deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}
