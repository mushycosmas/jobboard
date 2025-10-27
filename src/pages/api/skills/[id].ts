import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate ID
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });

  const skillId = parseInt(id, 10);
  if (isNaN(skillId)) return res.status(400).json({ message: "Invalid ID" });

  switch (req.method) {
    /**
     * 🟡 UPDATE skill
     */
    case "PUT":
      try {
        const { skill_name, updator_id, hide } = req.body;

        if (!skill_name)
          return res.status(400).json({ message: "Skill name is required" });

        const slug = slugify(skill_name, { lower: true, strict: true });

        const [result] = await db.query(
          "UPDATE skills SET skill_name = ?, slug = ?, updator_id = ?, hide = ? WHERE id = ?",
          [skill_name, slug, updator_id || null, hide || 0, skillId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Skill not found" });

        return res.status(200).json({ id: skillId, skill_name, slug });
      } catch (err) {
        console.error("Error updating skill:", err);
        return res.status(500).json({ message: "Failed to update skill" });
      }

    /**
     * 🔴 DELETE skill
     */
    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM skills WHERE id = ?", [skillId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Skill not found" });

        return res.status(200).json({ message: "Skill deleted successfully" });
      } catch (err) {
        console.error("Error deleting skill:", err);
        return res.status(500).json({ message: "Failed to delete skill" });
      }

    /**
     * 🚫 Unsupported method
     */
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
