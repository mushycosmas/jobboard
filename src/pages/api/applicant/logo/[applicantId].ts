import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Applicant ID is required" });
  }

  const applicantIdNum = Number(applicantId);
  if (isNaN(applicantIdNum)) {
    return res.status(400).json({ message: "Applicant ID must be a number" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT logo FROM applicants WHERE id = ?`,
      [applicantIdNum]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    return res.status(200).json({ logo: rows[0].logo || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
