import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import slugify from "slugify"; // npm install slugify

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { applicant_id, employer_id, collection_id, position_id, category_id, user_id } = req.body;

      if (!applicant_id || !employer_id || !user_id) {
        return res.status(400).json({ message: "Missing applicant_id, employer_id, or user_id" });
      }

      let finalPositionId = position_id;
      let finalCollectionId = collection_id;

      // Handle string position_id
      if (position_id && typeof position_id === "string") {
        const slug = slugify(position_id, { lower: true, strict: true });
        const [existingPosition] = await db.execute<RowDataPacket[]>(
          `SELECT id FROM positions WHERE slug = ?`,
          [slug]
        );

        if (existingPosition.length > 0) {
          finalPositionId = existingPosition[0].id;
        } else {
          const [posResult] = await db.execute<ResultSetHeader>(
            `INSERT INTO positions (name, slug, created_by) VALUES (?, ?, ?)`,
            [position_id, slug, user_id]
          );
          finalPositionId = posResult.insertId;
        }
      }

      // Handle string collection_id
      if (collection_id && typeof collection_id === "string") {
        const [existingCollection] = await db.execute<RowDataPacket[]>(
          `SELECT id FROM collections WHERE name = ? AND user_id = ?`,
          [collection_id, user_id]
        );

        if (existingCollection.length > 0) {
          finalCollectionId = existingCollection[0].id;
        } else {
          const [colResult] = await db.execute<ResultSetHeader>(
            `INSERT INTO collections (name, user_id) VALUES (?, ?)`,
            [collection_id, user_id]
          );
          finalCollectionId = colResult.insertId;
        }
      }

      // Save resume
      const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO saved_resumes (applicant_id, employer_id, collection_id, position_id, category_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [applicant_id, employer_id, finalCollectionId || null, finalPositionId || null, category_id || null, user_id]
      );

      return res.status(201).json({ message: "Saved resume created", result });
    }

    if (req.method === "GET") {
      const collection_id = req.query.collection_id as string;
      const user_id = req.query.user_id as string;

      // If collection_id is provided, fetch resumes in that collection
      if (collection_id) {
      const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT sr.id AS id,
       sr.applicant_id AS applicant_id,
       a.first_name,
       a.last_name,
       a.logo,
       p.name AS position_name,
       i.industry_name AS category_name,
       u.email,
       (SELECT phone_number FROM applicant_phones ap WHERE ap.applicant_id = a.id LIMIT 1) AS phone_number,
       (SELECT address FROM applicant_addresses aa WHERE aa.applicant_id = a.id LIMIT 1) AS address
FROM saved_resumes sr
LEFT JOIN applicants a ON sr.applicant_id = a.id
LEFT JOIN positions p ON sr.position_id = p.id
LEFT JOIN industries i ON sr.category_id = i.id
LEFT JOIN users u ON a.user_id = u.id
WHERE sr.collection_id = ?`,
  [collection_id]
);


        return res.status(200).json(rows);
      }

      // If user_id is provided (and no collection_id), fetch all collections for the user
      if (user_id) {
        const [rows] = await db.execute<RowDataPacket[]>(
          `SELECT 
              c.id AS collection_id,
              c.name AS collection_name,
              GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') AS position_names,
              GROUP_CONCAT(DISTINCT i.industry_name SEPARATOR ', ') AS category_name,
              COUNT(sr.id) AS Total_Data_Available
           FROM collections c
           LEFT JOIN saved_resumes sr ON sr.collection_id = c.id
           LEFT JOIN positions p ON sr.position_id = p.id
           LEFT JOIN industries i ON sr.category_id = i.id
           WHERE c.user_id = ?
           GROUP BY c.id, c.name`,
          [user_id]
        );

        return res.status(200).json(rows);
      }

      return res.status(400).json({ message: "Missing collection_id or user_id" });
    }

    if (req.method === "PUT") {
      const { id, applicant_id, collection_id, position_id, category_id, updator_id, user_id } = req.body;

      if (!id || !user_id) return res.status(400).json({ message: "Missing resume id or user_id" });

      const [result] = await db.execute<ResultSetHeader>(
        `UPDATE saved_resumes
         SET applicant_id = ?, collection_id = ?, position_id = ?, category_id = ?, updator_id = ?, user_id = ?
         WHERE id = ?`,
        [applicant_id, collection_id, position_id, category_id, updator_id || user_id, user_id, id]
      );

      return res.status(200).json({ message: "Saved resume updated", result });
    }

    if (req.method === "DELETE") {
      const id = req.query.id as string;
      const user_id = req.query.user_id as string;

      if (!id || !user_id) return res.status(400).json({ message: "Missing resume id or user_id" });

      const [result] = await db.execute<ResultSetHeader>(
        `DELETE FROM saved_resumes WHERE id = ? AND user_id = ?`,
        [id, user_id]
      );

      return res.status(200).json({ message: "Saved resume deleted", result });
    }

    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}
