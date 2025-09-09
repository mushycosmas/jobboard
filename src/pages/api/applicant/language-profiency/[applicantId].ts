// src/pages/api/applicant/language-profiency/[applicantId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId))
    return res.status(400).json({ message: "Applicant ID is required" });

  try {
    // GET: fetch all language proficiencies
    if (req.method === "GET") {
      const [rows] = await db.query(
        `SELECT 
          al.id,
          al.language_id,
          al.speak_id,
          al.read_id,
          al.write_id,
          l.name,
          sp.name AS speaking_skill,
          rd.name AS reading_skill,
          rw.name AS writing_skill
        FROM applicant_languages al
        JOIN languages l ON al.language_id = l.id
        LEFT JOIN language_speaks sp ON al.speak_id = sp.id
        LEFT JOIN language_reads rd ON al.read_id = rd.id
        LEFT JOIN language_writes rw ON al.write_id = rw.id
        WHERE al.applicant_id = ?`,
        [applicantId]
      );

      return res.status(200).json(rows);
    }

    // POST: add a new language
    if (req.method === "POST") {
      const { language_id, speak_id, read_id, write_id } = req.body;
      if (!language_id || !speak_id || !read_id || !write_id)
        return res.status(400).json({ message: "All fields are required" });

      const [result] = await db.query(
        `INSERT INTO applicant_languages 
         (applicant_id, language_id, speak_id, read_id, write_id)
         VALUES (?, ?, ?, ?, ?)`,
        [applicantId, language_id, speak_id, read_id, write_id]
      );

      const insertedId = (result as any).insertId;
      const [newRow] = await db.query(`SELECT * FROM applicant_languages WHERE id = ?`, [insertedId]);

      return res.status(201).json((newRow as any)[0]);
    }

    // PUT: update a language
    if (req.method === "PUT") {
      const { id, language_id, speak_id, read_id, write_id } = req.body;
      if (!id || !language_id || !speak_id || !read_id || !write_id)
        return res.status(400).json({ message: "All fields are required" });

      await db.query(
        `UPDATE applicant_languages
         SET language_id = ?, speak_id = ?, read_id = ?, write_id = ?
         WHERE id = ? AND applicant_id = ?`,
        [language_id, speak_id, read_id, write_id, id, applicantId]
      );

      const [updatedRow] = await db.query(`SELECT * FROM applicant_languages WHERE id = ?`, [id]);
      return res.status(200).json((updatedRow as any)[0]);
    }

    // DELETE: remove a language
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Language ID is required" });

      await db.query(
        `DELETE FROM applicant_languages WHERE id = ? AND applicant_id = ?`,
        [id, applicantId]
      );

      return res.status(200).json({ message: "Deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}
