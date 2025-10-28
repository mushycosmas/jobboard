import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const [users] = await db.query("SELECT id, username, email, hide, userType FROM users");
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }

  if (req.method === "POST") {
    try {
      const { username, email, password, userType } = req.body;

      if (!username || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        "INSERT INTO users (username, email, password, hide, userType) VALUES (?, ?, ?, 0, ?)",
        [username, email, hashedPassword, userType || "user"]
      );

      const newUser = {
        id: (result as any).insertId,
        username,
        email,
        hide: 0,
        userType: userType || "user",
      };

      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create user" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, username, email, userType } = req.body;
      if (!id || !username || !email)
        return res.status(400).json({ message: "Missing fields" });

      await db.query("UPDATE users SET username = ?, email = ?, userType = ? WHERE id = ?", [
        username,
        email,
        userType || "user",
        id,
      ]);

      res.status(200).json({ id, username, email, userType: userType || "user" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update user" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: "User ID required" });

      await db.query("DELETE FROM users WHERE id = ?", [id]);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
}
