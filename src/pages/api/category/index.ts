import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // 🟢 GET all cultures
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM cultures ORDER BY name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error("Error fetching cultures:", err);
        return res.status(500).json({ message: "Failed to fetch cultures" });
      }

    // 🟡 POST - Add new culture
    case "POST":
      try {
        const { name, description } = req.body;

        if (!name) {
          return res.status(400).json({ message: "Culture name is required" });
        }

        const [result] = await db.query(
          "INSERT INTO cultures (name, description) VALUES (?, ?)",
          [name, description || null]
        );

        return res.status(201).json({
          id: (result as any).insertId,
          name,
          description,
        });
      } catch (err) {
        console.error("Error adding culture:", err);
        return res.status(500).json({ message: "Failed to add culture" });
      }

    // 🔴 Unsupported methods
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
