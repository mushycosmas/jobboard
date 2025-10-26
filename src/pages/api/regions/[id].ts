import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid id" });

  const regionId = parseInt(id, 10);
  if (isNaN(regionId)) return res.status(400).json({ message: "Invalid id" });

  switch (req.method) {
    case "PUT":
      try {
        const { region_name, country_id } = req.body;
        if (!region_name || !country_id)
          return res.status(400).json({ message: "Region name and country ID are required" });

        const [result] = await db.query(
          "UPDATE regions SET name = ?, country_id = ? WHERE id = ?",
          [region_name, country_id, regionId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Region not found" });

        return res.status(200).json({ id: regionId, region_name, country_id });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update region" });
      }

    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM regions WHERE id = ?", [regionId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Region not found" });

        return res.status(200).json({ message: "Region deleted successfully" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete region" });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
