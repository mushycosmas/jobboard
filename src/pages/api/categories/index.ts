import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // 🟢 GET all categories
    case "GET":
      try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY name ASC");
        return res.status(200).json(rows);
      } catch (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({ message: "Failed to fetch categories" });
      }

    // 🟡 POST - Add new category
    case "POST":
      try {
        const { name } = req.body;

        if (!name) {
          return res.status(400).json({ message: "Category name is required" });
        }

        const [result] = await db.query(
          "INSERT INTO categories (name) VALUES (?)",
          [name]
        );

        return res.status(201).json({
          id: (result as any).insertId,
          name,
        });
      } catch (err) {
        console.error("Error adding category:", err);
        return res.status(500).json({ message: "Failed to add category" });
      }

    // 🚫 Unsupported methods
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
