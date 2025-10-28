import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db"; // ✅ Your MySQL connection file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    switch (req.method) {
      // ✅ Get user data
      case "GET": {
        const [rows]: any = await db.query(
          "SELECT id, username, email, phone FROM users WHERE id = ?",
          [id]
        );
        if (!rows || rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(rows[0]);
      }

      // ✅ Update user data
      case "PUT": {
        const { username, email, phone } = req.body;

        if (!username || !email) {
          return res.status(400).json({ message: "Username and email are required" });
        }

        await db.query(
          "UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?",
          [username.trim(), email.trim(), phone?.trim() || null, id]
        );

        return res.status(200).json({ message: "Profile updated successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("User update error:", error);
    return res.status(500).json({ message: "Server error while updating user profile" });
  }
}
