import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM job_types ORDER BY name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch job types" });
      }

    case "POST":
      try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Job type name is required" });

        const [result] = await db.query(
          "INSERT INTO job_types (name) VALUES (?)",
          [name]
        );

        return res.status(201).json({ id: (result as any).insertId, name });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add job type" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
