import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db"; // adjust if your db connection is elsewhere

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;
  const { method } = req;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ error: "Invalid applicantId" });
  }

  try {
    switch (method) {
      // 📌 Get all applications for an applicant with LEFT JOIN
      case "GET": {
        const [rows] = await db.query(
          `
          SELECT 
              aa.id, 
              aa.job_id,
              aa.applicant_id,
              aa.letter,
              aa.hide,
              aa.status,
              aa.stage_id,
              aa.created_at,
              aa.updated_at,
              j.title AS job_title,
              j.posting_date,
              j.expired_date
          FROM applicant_applications aa
          LEFT JOIN jobs j ON aa.job_id = j.id
          WHERE aa.applicant_id = ?
          ORDER BY aa.created_at DESC
          `,
          [applicantId]
        );
        return res.status(200).json(rows);
      }

      // 📌 Create a new application
      case "POST": {
        const { job_id, letter, status, hide } = req.body;
        const stage_id=1;

        if (!job_id || !letter) {
          return res.status(400).json({ error: "job_id and letter are required" });
        }

        await db.query(
          `
          INSERT INTO applicant_applications (job_id, applicant_id, letter, status, stage_id, hide, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
          `,
          [job_id, applicantId, letter, status || "Pending", stage_id || null, hide || 0]
        );

        return res.status(201).json({ message: "Application created successfully" });
      }

      // 📌 Update application
      case "PUT": {
        const { id, letter, status, stage_id, hide } = req.body;

        if (!id) return res.status(400).json({ error: "Application id is required" });

        await db.query(
          `
          UPDATE applicant_applications
          SET letter = ?, status = ?, stage_id = ?, hide = ?, updated_at = NOW()
          WHERE id = ? AND applicant_id = ?
          `,
          [letter, status || "Pending", stage_id || null, hide || 0, id, applicantId]
        );

        return res.status(200).json({ message: "Application updated successfully" });
      }

      // 📌 Delete application
      case "DELETE": {
        const { id } = req.query;

        if (!id || Array.isArray(id)) {
          return res.status(400).json({ error: "Application id is required" });
        }

        await db.query(
          `DELETE FROM applicant_applications WHERE id = ? AND applicant_id = ?`,
          [id, applicantId]
        );

        return res.status(200).json({ message: "Application deleted successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err: any) {
    console.error("Error in job applications API:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
