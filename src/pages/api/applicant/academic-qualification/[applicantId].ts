import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Fetch qualifications for an applicant
async function getQualifications(applicantId: string) {
  const query = `
    SELECT 
      ae.id,
      ae.applicant_id,
      ae.education_level_id,
      ae.category_id,
      ae.programme_id,
      ae.institution_id,
      ae.country_id,
      ae.attachment,
      ae.started,
      ae.ended,
      el.education_level,
      p.name AS programme,
      i.name AS institution,
      c.name AS country
    FROM applicant_educations ae
    LEFT JOIN programmes p ON ae.programme_id = p.id
    LEFT JOIN countries c ON ae.country_id = c.id
    LEFT JOIN institutions i ON ae.institution_id = i.id
    LEFT JOIN education_levels el ON ae.education_level_id = el.id
    WHERE ae.applicant_id = ?;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [applicantId]);
  return rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (typeof applicantId !== "string") {
    return res.status(400).json({ message: "Applicant ID must be a string" });
  }

  try {
    switch (req.method) {
      case "GET":
        const qualifications = await getQualifications(applicantId);
        return res.status(200).json(qualifications);

      case "POST":
        const {
          education_level_id,
          category_id,
          programme_id,
          institution_id,
          country_id,
          started,https://chatgpt.com/
          ended,
        } = req.body;

        // Validate required fields
        if (!education_level_id || !category_id || !country_id) {
          return res.status(400).json({
            message: "Education Level, Category, and Country are required",
          });
        }

        // Convert optional fields to null if empty
        const progId = programme_id ? Number(programme_id) : null;
        const instId = institution_id ? Number(institution_id) : null;

        const insertQuery = `
          INSERT INTO applicant_educations (
            applicant_id, education_level_id, category_id, programme_id, institution_id, country_id, started, ended
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const [result]: any = await db.execute<ResultSetHeader>(insertQuery, [
          Number(applicantId),
          Number(education_level_id),
          Number(category_id),
          progId,
          instId,
          Number(country_id),
          started || null,
          ended || null,
        ]);

        // Return the newly created row
        const [newRow] = await db.execute<RowDataPacket[]>(
          `SELECT * FROM applicant_educations WHERE id = ?`,
          [result.insertId]
        );

        return res.status(201).json(newRow[0]);

      case "PUT":
        const { id, ...updateData } = req.body;

        if (!id) return res.status(400).json({ message: "Qualification ID required" });

        const updateQuery = `
          UPDATE applicant_educations
          SET education_level_id = ?, category_id = ?, programme_id = ?, institution_id = ?, country_id = ?, started = ?, ended = ?
          WHERE id = ?;
        `;

        await db.execute(updateQuery, [
          Number(updateData.education_level_id),
          Number(updateData.category_id),
          updateData.programme_id ? Number(updateData.programme_id) : null,
          updateData.institution_id ? Number(updateData.institution_id) : null,
          Number(updateData.country_id),
          updateData.started || null,
          updateData.ended || null,
          Number(id),
        ]);

        const [updatedRow] = await db.execute<RowDataPacket[]>(
          `SELECT * FROM applicant_educations WHERE id = ?`,
          [id]
        );

        return res.status(200).json(updatedRow[0]);

      case "DELETE":
        const qualId = req.body.id || req.query.id;
        if (!qualId) return res.status(400).json({ message: "Qualification ID required" });

        await db.execute(`DELETE FROM applicant_educations WHERE id = ?`, [Number(qualId)]);
        return res.status(200).json({ message: "Qualification deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`${req.method} error:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
