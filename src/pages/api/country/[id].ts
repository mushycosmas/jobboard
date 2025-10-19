
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid id" });

  const countryId = parseInt(id, 10);
  if (isNaN(countryId)) return res.status(400).json({ message: "Invalid id" });

  switch (req.method) {
    case "PUT":
      try {
        const { name, country_code, currency } = req.body;
        if (!name || !country_code || !currency)
          return res.status(400).json({ message: "All fields are required" });

        const [result] = await db.query(
          "UPDATE countries SET name = ?, country_code = ?, currency = ? WHERE id = ?",
          [name, country_code, currency, countryId]
        );

        if ((result as any).affectedRows === 0) return res.status(404).json({ message: "Country not found" });

        return res.status(200).json({ id: countryId, name, country_code, currency });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update country" });
      }

    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM countries WHERE id = ?", [countryId]);
        if ((result as any).affectedRows === 0) return res.status(404).json({ message: "Country not found" });

        return res.status(200).json({ message: "Country deleted successfully" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete country" });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
