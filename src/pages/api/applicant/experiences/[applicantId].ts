// src/pages/api/applicant/language-profiency/[applicantId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Invalid applicantId" });
  }

  switch (req.method) {
    case "GET":
      return getLanguages(applicantId, res);
    case "POST":
      return saveLanguage(req, res, applicantId);
    case "PUT":
      return updateLanguage(req, res, applicantId);
    case "DELETE":
      return deleteLanguage(req, res, applicantId);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

/**
 * GET all languages
 */
async function getLanguages(applicantId: string, res: NextApiResponse) {
  try {
    const [rows] = await db.query(`
      SELECT 
        al.id,
        l.name,
        rw.name AS writing_skill,
        rd.name AS reading_skill,
        sp.name AS speaking_skill
      FROM applicant_languages al
      JOIN languages l ON al.language_id = l.id
      LEFT JOIN language_writes rw ON al.write_id = rw.id
      LEFT JOIN language_reads rd ON al.read_id = rd.id
      LEFT JOIN language_speaks sp ON al.speak_id = sp.id
      WHERE al.applicant_id = ?
    `, [applicantId]);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching languages:", err);
    return res.status(500).json({ message: "Failed to fetch languages" });
  }
}

/**
 * POST new language
 */
async function saveLanguage(req: NextApiRequest, res: NextApiResponse, applicantId: string) {
  try {
    const { language_id, speak_id, read_id, write_id } = req.body;

    if (!language_id || !speak_id || !read_id || !write_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await db.query(`
      INSERT INTO applicant_languages (applicant_id, language_id, speak_id, read_id, write_id)
      VALUES (?, ?, ?, ?, ?)
    `, [applicantId, language_id, speak_id, read_id, write_id]);

    const insertedId = (result as any).insertId;
    const [newRow] = await db.query(`SELECT * FROM applicant_languages WHERE id = ?`, [insertedId]);

    return res.status(201).json((newRow as any)[0]);
  } catch (err) {
    console.error("Error saving language:", err);
    return res.status(500).json({ message: "Failed to save language" });
  }
}

/**
 * PUT update language
 */
async function updateLanguage(req: NextApiRequest, res: NextApiResponse, applicantId: string) {
  try {
    const { id, language_id, speak_id, read_id, write_id } = req.body;

    if (!id) return res.status(400).json({ message: "Language ID is required" });

    await db.query(`
      UPDATE applicant_languages
      SET language_id = ?, speak_id = ?, read_id = ?, write_id = ?
      WHERE id = ? AND applicant_id = ?
    `, [language_id, speak_id, read_id, write_id, id, applicantId]);

    return res.status(200).json({ message: "Language updated successfully" });
  } catch (err) {
    console.error("Error updating language:", err);
    return res.status(500).json({ message: "Failed to update language" });
  }
}

/**
 * DELETE language
 */
async function deleteLanguage(req: NextApiRequest, res: NextApiResponse, applicantId: string) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Language ID is required" });

    await db.query(`DELETE FROM applicant_languages WHERE id = ? AND applicant_id = ?`, [id, applicantId]);

    return res.status(200).json({ message: "Language deleted successfully" });
  } catch (err) {
    console.error("Error deleting language:", err);
    return res.status(500).json({ message: "Failed to delete language" });
  }
}
