import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db"; // your MySQL connection
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    let { userId, currentPassword, newPassword } = req.body;

    // Trim inputs to remove accidental spaces
    currentPassword = currentPassword?.trim();
    newPassword = newPassword?.trim();

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the user's current password hash from DB
    const [rows]: any = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedHash = rows[0].password;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Prevent using the same password
    const isSamePassword = await bcrypt.compare(newPassword, storedHash);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as current password" });
    }

    // Hash the new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await db.query("UPDATE users SET password = ? WHERE id = ?", [newHash, userId]);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    return res.status(500).json({ message: "Internal server error", error: err });
  }
}
