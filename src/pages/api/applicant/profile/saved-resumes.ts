import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      // Create a new saved resume
      const { applicant_id, employer_id, collection_id, position_id, category_id } = req.body;

      if (!applicant_id || !employer_id) {
        return res.status(400).json({ message: "Missing applicant_id or employer_id" });
      }

      const query = `
        INSERT INTO saved_resumes (
          applicant_id,
          employer_id,
          collection_id,
          position_id,
          category_id
        ) VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        applicant_id,
        employer_id,
        collection_id,
        position_id,
        category_id,
      ]);

      return res.status(201).json({ message: "Saved resume created", result });
    }

    if (req.method === "GET") {
      // Get all saved resumes by employer and collection
      const employer_id = req.query.employer_id as string;
      const collection_id = req.query.collection_id as string;

      if (!employer_id || !collection_id) {
        return res.status(400).json({ message: "Missing employer_id or collection_id" });
      }

      const query = `
        SELECT 
          sr.id AS resume_id,
          sr.applicant_id,
          sr.employer_id,
          sr.collection_id,
          sr.position_id,
          sr.category_id,
          e.company_name AS employer_name,
          c.name AS collection_name,
          p.name AS position_name,
          i.industry_name AS category_name,
          a.first_name,
          a.last_name,
          a.id,
          a.logo,
          u.email,
          ap.phone_number,
          aa.address,
          r.name AS region_name,
          cn.name AS applicant_country,
          m.name AS applicant_marital_status,
          g.name AS applicant_gender
        FROM saved_resumes sr
        LEFT JOIN employers e ON sr.employer_id = e.id
        LEFT JOIN collections c ON sr.collection_id = c.id
        LEFT JOIN positions p ON sr.position_id = p.id
        LEFT JOIN industries i ON sr.category_id = i.id
        LEFT JOIN applicants a ON sr.applicant_id = a.id
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id
        LEFT JOIN regions r ON aa.region_id = r.id
        LEFT JOIN countries cn ON r.country_id = cn.id
        LEFT JOIN marital_statuses m ON a.marital_id = m.id
        LEFT JOIN genders g ON a.gender_id = g.id
        LEFT JOIN applicant_phones ap ON a.id = ap.applicant_id
        WHERE sr.employer_id = ? AND sr.collection_id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [employer_id, collection_id]);
      return res.status(200).json(rows);
    }

    if (req.method === "PUT") {
      // Update saved resume
      const { id, applicant_id, collection_id, position_id, category_id, updator_id } = req.body;
      if (!id) return res.status(400).json({ message: "Missing resume id" });

      const query = `
        UPDATE saved_resumes
        SET 
          applicant_id = ?,
          collection_id = ?,
          position_id = ?,
          category_id = ?,
          updator_id = ?
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        applicant_id,
        collection_id,
        position_id,
        category_id,
        updator_id,
        id,
      ]);

      return res.status(200).json({ message: "Saved resume updated", result });
    }

    if (req.method === "DELETE") {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ message: "Missing resume id" });

      const query = `DELETE FROM saved_resumes WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);
      return res.status(200).json({ message: "Saved resume deleted", result });
    }

    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}
