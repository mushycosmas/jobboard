import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });

  const typeId = parseInt(id, 10);
  if (isNaN(typeId)) return res.status(400).json({ message: "Invalid ID" });

  switch (req.method) {
    case "PUT":
      try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Job type name is required" });

        const [result] = await db.query(
          "UPDATE job_types SET name = ? WHERE id = ?",
          [name, typeId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Job type not found" });

        return res.status(200).json({ id: typeId, name });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update job type" });
      }

    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM job_types WHERE id = ?", [typeId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Job type not found" });

        return res.status(200).json({ message: "Job type deleted successfully" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete job type" });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
