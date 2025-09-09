import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Applicant ID is required" });
  }

  const applicantIdNum = Number(applicantId);
  if (isNaN(applicantIdNum)) return res.status(400).json({ message: "Applicant ID must be a number" });

  try {
    // GET: fetch all applicant_referees
    if (req.method === "GET") {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT * FROM applicant_referees WHERE applicant_id = ?`,
        [applicantIdNum]
      );
      return res.status(200).json(rows);
    }

    // POST: add new referee
    if (req.method === "POST") {
      const {
        first_name,
        last_name,
        institution,
        referee_position,
        email,
        phone,
      } = req.body;

      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO applicant_referees 
         (applicant_id, first_name, last_name, institution, referee_position, email, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          applicantIdNum,
          first_name ?? null,
          last_name ?? null,
          institution ?? null,
          referee_position ?? null,
          email ?? null,
          phone ?? null,
        ]
      );

      return res.status(201).json({ message: "Referee added successfully", id: result.insertId });
    }

    // PUT: update referee
    if (req.method === "PUT") {
      const idParam = req.query.id;
      const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);
      if (!id) return res.status(400).json({ message: "Referee ID is required for update" });

      const {
        first_name,
        last_name,
        institution,
        referee_position,
        email,
        phone,
      } = req.body;

      await db.query(
        `UPDATE applicant_referees 
         SET first_name = ?, last_name = ?, institution = ?, referee_position = ?, email = ?, phone = ?
         WHERE id = ? AND applicant_id = ?`,
        [
          first_name ?? null,
          last_name ?? null,
          institution ?? null,
          referee_position ?? null,
          email ?? null,
          phone ?? null,
          id,
          applicantIdNum,
        ]
      );

      return res.status(200).json({ message: "Referee updated successfully" });
    }

    // DELETE: remove referee
    if (req.method === "DELETE") {
      const idParam = req.query.id;
      const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);
      if (!id) return res.status(400).json({ message: "Referee ID is required for delete" });

      await db.query(`DELETE FROM applicant_referees WHERE id = ? AND applicant_id = ?`, [id, applicantIdNum]);
      return res.status(200).json({ message: "Referee deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}
