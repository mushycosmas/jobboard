import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  const connection = await db.getConnection();

  try {
    if (req.method === "PUT") {
      const { username, email } = req.body;
      await connection.query(`UPDATE users SET username = ?, email = ? WHERE id = ?`, [username, email, userId]);
      return res.status(200).json({ message: "User updated" });
    }

    if (req.method === "DELETE") {
      await connection.query(`DELETE FROM users WHERE id = ?`, [userId]);
      await connection.query(`DELETE FROM user_employers WHERE user_id = ?`, [userId]);
      return res.status(200).json({ message: "User deleted" });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
}
