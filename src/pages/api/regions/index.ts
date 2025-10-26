import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export interface Region {
  id: number;
  name: string;
  country_id: number;
  country_name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const [rows] = await db.query(`
          SELECT r.id, r.name, r.country_id, c.name AS country_name
          FROM regions r
          LEFT JOIN countries c ON r.country_id = c.id
          ORDER BY r.name ASC
        `);
        return res.status(200).json(rows as Region[]);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch regions" });
      }

    case "POST":
      try {
        const { name, country_id } = req.body;
        if (!name || !country_id)
          return res.status(400).json({ message: "Region name and country ID are required" });

        const [result] = await db.query(
          "INSERT INTO regions (name, country_id) VALUES (?, ?)",
          [name, country_id]
        );

        // Optionally fetch country name for response
        const [[country]] = await db.query("SELECT name FROM countries WHERE id = ?", [country_id]);

        return res.status(201).json({
          id: (result as any).insertId,
          name,
          country_id,
          country_name: (country as any)?.name || "",
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add region" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
