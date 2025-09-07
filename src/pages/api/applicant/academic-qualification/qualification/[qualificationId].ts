// /pages/api/applicant/academic-qualification/qualification/[qualificationId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { qualificationId } = req.query;

  if (!qualificationId || Array.isArray(qualificationId)) {
    return res.status(400).json({ message: "Qualification ID is required" });
  }

  const qualId = parseInt(qualificationId);
  if (isNaN(qualId)) {
    return res.status(400).json({ message: "Qualification ID must be numeric" });
  }

  try {
    switch (req.method) {
      case "PUT":
        const {
          education_level_id,
          category_id,
          programme_id,
          institution_id,
          country_id,
          started,
          ended,
        } = req.body;

        if (!education_level_id || !category_id || !programme_id || !institution_id || !country_id) {
          return res.status(400).json({ message: "All required fields must be provided" });
        }

        const updateQuery = `
          UPDATE applicant_educations
          SET education_level_id = ?, category_id = ?, programme_id = ?, institution_id = ?, country_id = ?, started = ?, ended = ?
          WHERE id = ?;
        `;

        await db.execute(updateQuery, [
          education_level_id,
          category_id,
          programme_id,
          institution_id,
          country_id,
          started || null,
          ended || null,
          qualId,
        ]);

        // Return updated row
        const [updatedRow] = await db.execute(
          `SELECT * FROM applicant_educations WHERE id = ?`,
          [qualId]
        );

        return res.status(200).json(updatedRow[0]);

      case "DELETE":
        await db.execute(`DELETE FROM applicant_educations WHERE id = ?`, [qualId]);
        return res.status(200).json({ message: "Qualification deleted successfully" });

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`${req.method} error:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
