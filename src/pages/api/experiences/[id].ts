import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });

  const experienceId = parseInt(id, 10);
  if (isNaN(experienceId)) return res.status(400).json({ message: "Invalid ID" });

  switch (req.method) {
    // 🟡 UPDATE experience
    case "PUT":
      try {
        const { name, years_min, years_max } = req.body;
        if (!name) return res.status(400).json({ message: "Experience name is required" });

        const [result] = await db.query(
          "UPDATE experiences SET name = ?, years_min = ?, years_max = ? WHERE id = ?",
          [name, years_min || null, years_max || null, experienceId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Experience not found" });

        return res.status(200).json({ id: experienceId, name, years_min, years_max });
      } catch (err) {
        console.error("Error updating experience:", err);
        return res.status(500).json({ message: "Failed to update experience" });
      }

    // 🔴 DELETE experience
    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM experiences WHERE id = ?", [experienceId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Experience not found" });

        return res.status(200).json({ message: "Experience deleted successfully" });
      } catch (err) {
        console.error("Error deleting experience:", err);
        return res.status(500).json({ message: "Failed to delete experience" });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
