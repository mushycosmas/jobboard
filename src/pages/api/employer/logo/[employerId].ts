import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { employerId } = req.query;

  if (!employerId || typeof employerId !== "string") {
    return res.status(400).json({ error: "Employer ID is required" });
  }

  try {
    const query = `SELECT logo FROM employers WHERE id = ? LIMIT 1`;
    const [rows] = await db.query<RowDataPacket[]>(query, [employerId]);

    if (!rows.length || !rows[0].logo) {
      return res.status(404).json({ error: "Logo not found" });
    }

    const logoUrl = `/uploads/${rows[0].logo}`; // Matches public/uploads folder

    return res.status(200).json({ logo: logoUrl });
  } catch (error) {
    console.error("Error fetching employer logo:", error);
    return res.status(500).json({ error: "Failed to fetch employer logo" });
  }
}
