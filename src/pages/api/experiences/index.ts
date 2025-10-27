import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // ✅ Get all experiences
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM experiences ORDER BY name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch experiences" });
      }

    // ✅ Add new experience
    case "POST":
      try {
        const { name, years_min, years_max } = req.body;
        if (!name) return res.status(400).json({ message: "Experience name is required" });

        const [result] = await db.query(
          "INSERT INTO experiences (name, years_min, years_max) VALUES (?, ?, ?)",
          [name, years_min || null, years_max || null]
        );

        return res.status(201).json({ id: (result as any).insertId, name, years_min, years_max });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add experience" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
