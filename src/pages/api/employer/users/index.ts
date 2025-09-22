import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // MySQL pool

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET users linked to an employer
    if (req.method === "GET") {
      const { employerId } = req.query;
      if (!employerId) return res.status(400).json({ message: "Missing employerId" });

      const [users] = await db.query(
        `SELECT u.id, u.username, u.email, u.userType, u.hide, ue.employer_id AS employerId
         FROM users u
         JOIN user_employers ue ON u.id = ue.user_id
         WHERE ue.employer_id = ?`,
        [Number(employerId)]
      );

      return res.status(200).json(users);
    }

    // CREATE a new user and link to existing employer
    if (req.method === "POST") {
      const { username, email, password, userType, employerId } = req.body;
      if (!username || !email || !password || !userType || !employerId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await db.query(
        "INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, userType]
      );

      const userId = result.insertId;

      // Link user to existing employer (avoid duplicate link)
      await db.query(
        "INSERT IGNORE INTO user_employers (user_id, employer_id) VALUES (?, ?)",
        [userId, employerId]
      );

      return res.status(201).json({ id: userId, username, email, userType, employerId });
    }

    // UPDATE user
    if (req.method === "PUT") {
      const { userId, username, email } = req.body;
      if (!userId || !username || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await db.query("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, userId]);
      return res.status(200).json({ message: "User updated" });
    }

    // DELETE user and remove link to employer
    if (req.method === "DELETE") {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: "Missing userId" });

      await db.query("DELETE FROM user_employers WHERE user_id = ?", [Number(userId)]);
      await db.query("DELETE FROM users WHERE id = ?", [Number(userId)]);

      return res.status(200).json({ message: "User deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
