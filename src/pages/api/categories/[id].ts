import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // 🧩 Validate ID
  if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid id" });

  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) return res.status(400).json({ message: "Invalid id" });

  switch (req.method) {
    // 🟡 UPDATE category
    case "PUT":
      try {
        const { name } = req.body;

        if (!name)
          return res.status(400).json({ message: "Category name is required" });

        const [result] = await db.query(
          "UPDATE categories SET name = ? WHERE id = ?",
          [name, categoryId]
        );

        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Category not found" });

        return res.status(200).json({ id: categoryId, name });
      } catch (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ message: "Failed to update category" });
      }

    // 🔴 DELETE category
    case "DELETE":
      try {
        const [result] = await db.query("DELETE FROM categories WHERE id = ?", [categoryId]);
        if ((result as any).affectedRows === 0)
          return res.status(404).json({ message: "Category not found" });

        return res.status(200).json({ message: "Category deleted successfully" });
      } catch (err) {
        console.error("Error deleting category:", err);
        return res.status(500).json({ message: "Failed to delete category" });
      }

    // 🚫 Unsupported methods
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}
