import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Applicant ID is required" });
  }

  const applicantIdNum = Number(applicantId);
  if (isNaN(applicantIdNum)) {
    return res.status(400).json({ message: "Applicant ID must be a number" });
  }

  try {
    // GET: fetch all social media links
    if (req.method === "GET") {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT a.id, a.social_media_id, sm.name AS social_media_name, a.url
         FROM applicant_social_medias a
         INNER JOIN social_medias sm ON a.social_media_id = sm.id
         WHERE a.applicant_id = ?`,
        [applicantIdNum]
      );
      return res.status(200).json(rows);
    }

    // POST: add a new social media link
    if (req.method === "POST") {
      const { social_media_id, url } = req.body;

      if (!social_media_id || !url) {
        return res.status(400).json({ message: "Social media ID and URL are required" });
      }

      await db.query<ResultSetHeader>(
        `INSERT INTO applicant_social_medias (applicant_id, social_media_id, url)
         VALUES (?, ?, ?)`,
        [applicantIdNum, social_media_id, url]
      );

      return res.status(201).json({ message: "Social media link added successfully" });
    }

    // PUT: update an existing social media link
    if (req.method === "PUT") {
      const { id, social_media_id, url } = req.body;

      if (!id || !social_media_id || !url) {
        return res.status(400).json({ message: "ID, Social media ID, and URL are required" });
      }

      await db.query<ResultSetHeader>(
        `UPDATE applicant_social_medias
         SET social_media_id = ?, url = ?
         WHERE id = ? AND applicant_id = ?`,
        [social_media_id, url, id, applicantIdNum]
      );

      return res.status(200).json({ message: "Social media link updated successfully" });
    }

    // DELETE: remove a social media link
    if (req.method === "DELETE") {
      const idParam = req.query.id;
      const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);

      if (!id) {
        return res.status(400).json({ message: "Social media record ID is required" });
      }

      await db.query<ResultSetHeader>(
        `DELETE FROM applicant_social_medias WHERE id = ? AND applicant_id = ?`,
        [id, applicantIdNum]
      );

      return res.status(200).json({ message: "Social media link deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}
