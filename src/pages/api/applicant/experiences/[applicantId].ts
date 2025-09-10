// src/pages/api/applicant/experiences/[applicantId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Invalid applicantId" });
  }

  switch (req.method) {
    case "GET":
      return getExperiences(applicantId, res);
    case "POST":
      return saveExperience(req, res, applicantId);
    case "PUT":
      return updateExperience(req, res, applicantId);
    case "DELETE":
      return deleteExperience(req, res, applicantId);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

/**
 * GET all experiences
 */
async function getExperiences(applicantId: string, res: NextApiResponse) {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        ae.id, 
        i.name AS institution, 
        p.name AS position, 
        ae.from_date AS \`from\`, 
        ae.to_date AS \`to\`, 
        ae.is_currently_working,
        ae.responsibility AS responsibilities
      FROM applicant_experiences ae
      JOIN institutions i ON ae.institution_id = i.id
      JOIN positions p ON ae.position_id = p.id
      WHERE ae.applicant_id = ?
      ORDER BY ae.from_date DESC
      `,
      [applicantId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    return res.status(500).json({ message: "Failed to fetch experiences" });
  }
}

/**
 * POST new experience
 */
async function saveExperience(req: NextApiRequest, res: NextApiResponse, applicantId: string) {
  try {
    const { institution_id, position_id, from_date, to_date, is_currently_working, responsibility } = req.body;

    if (!institution_id || !position_id || !from_date) {
      return res.status(400).json({ message: "Institution, Position, and From date are required" });
    }

    const [result] = await db.query(
      `
      INSERT INTO applicant_experiences 
        (applicant_id, institution_id, position_id, from_date, to_date, is_currently_working, responsibility)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        applicantId,
        institution_id,
        position_id,
        from_date,
        to_date || null,
        is_currently_working ? 1 : 0,
        responsibility || null,
      ]
    );

    return res.status(201).json({ id: (result as any).insertId, message: "Experience saved successfully" });
  } catch (err) {
    console.error("Error saving experience:", err);
    return res.status(500).json({ message: "Failed to save experience" });
  }
}

/**
 * PUT update experience
 */
async function updateExperience(req: NextApiRequest, res: NextApiResponse, applicantId: string) {
  try {
    const { id, institution_id, position_id, from_date, to_date, is_currently_working, responsibility } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Experience ID is required" });
    }

    await db.query(
      `
      UPDATE applicant_experiences
      SET institution_id = ?, position_id = ?, from_date = ?, to_date = ?, is_currently_working = ?, responsibility = ?
      WHERE id = ? AND applicant_id = ?
      `,
      [
        institution_id,
        position_id,
        from_date,
        to_date || null,
        is_currently_working ? 1 : 0,
        responsibility || null,
        id,
        applicantId,
      ]
    );

    return res.status(200).json({ message: "Experience updated successfully" });
  } catch (err) {
    console.error("Error updating experience:", err);
    return res.status(500).json({ message: "Failed to update experience" });
  }
}

/**
 * DELETE experience
 */
async function deleteExperience(req: NextApiRequest, res: NextApiResponse, applicantId: string) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Experience ID is required" });
    }

    await db.query("DELETE FROM applicant_experiences WHERE id = ? AND applicant_id = ?", [id, applicantId]);

    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (err) {
    console.error("Error deleting experience:", err);
    return res.status(500).json({ message: "Failed to delete experience" });
  }
}
