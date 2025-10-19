import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM countries ORDER BY name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch countries" });
      }

    case "POST":
      try {
        const { name, country_code, currency } = req.body;
        if (!name || !country_code || !currency)
          return res.status(400).json({ message: "All fields are required" });

        const [result] = await db.query(
          "INSERT INTO countries (name, country_code, currency) VALUES (?, ?, ?)",
          [name, country_code, currency]
        );

        return res.status(201).json({ id: (result as any).insertId, name, country_code, currency });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add country" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
