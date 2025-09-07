import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Fetch qualifications for an applicant
async function getQualifications(applicantId: number) {
  const query = `
    SELECT 
      ap.id,
      ap.applicant_id,
      ap.country_id,
      ap.institution_id,
      ap.course_id,
      ap.attachment,
      ap.started,
      ap.ended,
      c.name AS country,
      i.name AS institution,
      co.name AS course
    FROM applicant_professionals ap
    JOIN countries c ON ap.country_id = c.id
    JOIN institutions i ON ap.institution_id = i.id
    JOIN courses co ON ap.course_id = co.id
    WHERE ap.applicant_id = ?;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [applicantId]);
  return rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const applicantIdParam = req.query.applicantId;
    if (!applicantIdParam || Array.isArray(applicantIdParam)) {
      return res.status(400).json({ message: "Applicant ID is required and must be a single value" });
    }

    const applicantId = Number(applicantIdParam);
    if (isNaN(applicantId)) {
      return res.status(400).json({ message: "Applicant ID must be a number" });
    }

    switch (req.method) {
      case "GET": {
        const qualifications = await getQualifications(applicantId);
        return res.status(200).json(qualifications);
      }

      case "POST": {
        const { country_id, institution_id, course_id, started, ended, creator_id, updator_id } = req.body;

        if (!country_id || !institution_id || !course_id) {
          return res.status(400).json({ message: "Country, Institution, and Course are required" });
        }

        const insertQuery = `
          INSERT INTO applicant_professionals
            (applicant_id, country_id, institution_id, course_id, started, ended, creator_id, updator_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const [result]: any = await db.execute<ResultSetHeader>(insertQuery, [
          applicantId,
          Number(country_id),
          Number(institution_id),
          Number(course_id),
          started || null,
          ended || null,
          creator_id || null,
          updator_id || null,
        ]);

        const [newRow] = await db.execute<RowDataPacket[]>(`
          SELECT 
            ap.id,
            ap.applicant_id,
            ap.country_id,
            ap.institution_id,
            ap.course_id,
            ap.attachment,
            ap.started,
            ap.ended,
            c.name AS country,
            i.name AS institution,
            co.name AS course
          FROM applicant_professionals ap
          JOIN countries c ON ap.country_id = c.id
          JOIN institutions i ON ap.institution_id = i.id
          JOIN courses co ON ap.course_id = co.id
          WHERE ap.id = ?;
        `, [result.insertId]);

        return res.status(201).json(newRow[0]);
      }

      case "PUT": {
        const { id, country_id, institution_id, course_id, started, ended, updator_id } = req.body;

        if (!id) return res.status(400).json({ message: "Qualification ID required" });
        if (!country_id || !institution_id || !course_id) {
          return res.status(400).json({ message: "Country, Institution, and Course are required" });
        }

        const updateQuery = `
          UPDATE applicant_professionals
          SET country_id = ?, institution_id = ?, course_id = ?, started = ?, ended = ?, updator_id = ?
          WHERE id = ?;
        `;

        await db.execute(updateQuery, [
          Number(country_id),
          Number(institution_id),
          Number(course_id),
          started || null,
          ended || null,
          updator_id || null,
          Number(id),
        ]);

        const [updatedRow] = await db.execute<RowDataPacket[]>(`
          SELECT 
            ap.id,
            ap.applicant_id,
            ap.country_id,
            ap.institution_id,
            ap.course_id,
            ap.attachment,
            ap.started,
            ap.ended,
            c.name AS country,
            i.name AS institution,
            co.name AS course
          FROM applicant_professionals ap
          JOIN countries c ON ap.country_id = c.id
          JOIN institutions i ON ap.institution_id = i.id
          JOIN courses co ON ap.course_id = co.id
          WHERE ap.id = ?;
        `, [id]);

        return res.status(200).json(updatedRow[0]);
      }

      case "DELETE": {
     const { id } = req.body; // qualification id
  if (!id) return res.status(400).json({ message: "Qualification ID is required" });

  await db.query("DELETE FROM applicant_professionals WHERE id = ?", [id]);
  return res.status(200).json({ message: "Deleted successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`${req.method} error:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
