import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    /**
     * 🟢 GET — Fetch all skills
     */
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM skills ORDER BY skill_name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch skills" });
      }

    /**
     * 🟡 POST — Create a new skill
     */
    case "POST":
      try {
        const { skill_name, creator_id, updator_id, hide } = req.body;

        if (!skill_name)
          return res.status(400).json({ message: "Skill name is required" });

        const slug = slugify(skill_name, { lower: true, strict: true });

        const [result] = await db.query(
          "INSERT INTO skills (skill_name, slug, creator_id, updator_id, hide) VALUES (?, ?, ?, ?, ?)",
          [skill_name, slug, creator_id || null, updator_id || null, hide || 0]
        );

        return res
          .status(201)
          .json({ id: (result as any).insertId, skill_name, slug });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add skill" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
