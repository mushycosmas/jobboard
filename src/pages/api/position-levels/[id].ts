import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate ID
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });

  const positionId = parseInt(id, 10);
  if (isNaN(positionId)) return res.status(400).json({ message: "Invalid ID" });

  switch (req.method) {
    // 🟡 UPDATE position level
    case "PUT":
      try {
        const { position_name } = req.body;
        if (!position_name)
          return res.status(400).json({ message: "Position name is required" });

        const slug = slugify(position_name, { lower: true, strict: true });

        const [result] = await db.query(
          "UPDATE position_levels SET position_name = ?, slug = ? WHERE id = ?",
          [position_name, slug, positionId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Position level not found" });

        return res.status(200).json({ id: positionId, position_name, slug });
      } catch (err) {
        console.error("Error updating position level:", err);
        return res.status(500).json({ message: "Failed to update position level" });
      }

    // 🔴 DELETE position level
    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM position_levels WHERE id = ?", [positionId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Position level not found" });

        return res.status(200).json({ message: "Position level deleted successfully" });
      } catch (err) {
        console.error("Error deleting position level:", err);
        return res.status(500).json({ message: "Failed to delete position level" });
      }

    // 🚫 Unsupported method
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
