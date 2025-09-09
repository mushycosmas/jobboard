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
    // GET: fetch all skills
    if (req.method === "GET") {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT a.id, s.skill_name
         FROM applicant_skills a
         INNER JOIN skills s ON a.skill_id = s.id
         WHERE a.applicant_id = ?`,
        [applicantIdNum]
      );
      return res.status(200).json(rows);
    }

    // POST: add multiple skills
    if (req.method === "POST") {
      const skills: { skill_id: number | string }[] = req.body;

      if (!Array.isArray(skills) || skills.length === 0)
        return res.status(400).json({ message: "Skills array is required" });

      const insertPromises = skills.map(skill =>
        db.query<ResultSetHeader>(
          `INSERT INTO applicant_skills (applicant_id, skill_id) VALUES (?, ?)`,
          [applicantIdNum, skill.skill_id]
        )
      );

      await Promise.all(insertPromises);
      return res.status(201).json({ message: "Skills added successfully" });
    }

    // DELETE: remove a skill
    if (req.method === "DELETE") {
      const idParam = req.query.id;
      const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);

      if (!id) return res.status(400).json({ message: "Skill ID is required" });

      await db.query(`DELETE FROM applicant_skills WHERE id = ? AND applicant_id = ?`, [id, applicantIdNum]);
      return res.status(200).json({ message: "Skill deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}
