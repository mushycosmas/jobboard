import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import slugify from "slugify"; // ✅ Install with: npm install slugify

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // 🟢 GET all position levels
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM position_levels ORDER BY position_name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error("Error fetching position levels:", err);
        return res.status(500).json({ message: "Failed to fetch position levels" });
      }

    // 🟡 POST - Add new position level
    case "POST":
      try {
        const { position_name, description } = req.body;
        if (!position_name)
          return res.status(400).json({ message: "Position name is required" });

        const slug = slugify(position_name, { lower: true, strict: true });

        const [result] = await db.query(
          "INSERT INTO position_levels (position_name, slug, description) VALUES (?, ?, ?)",
          [position_name, slug, description || null]
        );

        return res.status(201).json({
          id: (result as any).insertId,
          position_name,
          slug,
          description,
        });
      } catch (err) {
        console.error("Error adding position level:", err);
        return res.status(500).json({ message: "Failed to add position level" });
      }

    // 🚫 Unsupported method
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
