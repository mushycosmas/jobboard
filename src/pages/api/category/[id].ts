import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // 🧩 Validate ID
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid id" });

  const cultureId = parseInt(id, 10);
  if (isNaN(cultureId)) return res.status(400).json({ message: "Invalid id" });

  switch (req.method) {
    // 🟡 UPDATE culture
    case "PUT":
      try {
        const { name, description } = req.body;

        if (!name)
          return res.status(400).json({ message: "Culture name is required" });

        const [result] = await db.query(
          "UPDATE cultures SET name = ?, description = ? WHERE id = ?",
          [name, description || null, cultureId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Culture not found" });

        return res.status(200).json({ id: cultureId, name, description });
      } catch (err) {
        console.error("Error updating culture:", err);
        return res.status(500).json({ message: "Failed to update culture" });
      }

    // 🔴 DELETE culture
    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM cultures WHERE id = ?", [cultureId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Culture not found" });

        return res.status(200).json({ message: "Culture deleted successfully" });
      } catch (err) {
        console.error("Error deleting culture:", err);
        return res.status(500).json({ message: "Failed to delete culture" });
      }

    // 🚫 Unsupported methods
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
