import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import formidable from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parse error" });

    // Helper to get field as string
    const getField = (key: string) => {
      const value = fields[key];
      return typeof value === "string" ? value : Array.isArray(value) ? value[0] : "";
    };

    const username = getField("username");
    const email = getField("email");
    const password = getField("password");
    const userType = getField("userType") || "employer";
    const state_id = getField("state_id");
    const address = getField("address");
    const phonenumber = getField("phonenumber");
    const company_name = getField("company_name");
    const employer_email = getField("employer_email");
    const aboutCompany = getField("aboutCompany");
    const industry_id = getField("industry_id");

    if (!username || !email || !password || !company_name || !employer_email) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      let logoPath: string | null = null;
      if (files.logo) {
        const file = Array.isArray(files.logo) ? files.logo[0] : files.logo;
        logoPath = `/uploads/${path.basename(file.filepath)}`;
      }

      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Check uniqueness
        const [existingUsers]: any = await connection.query(
          `SELECT id, username, email FROM users WHERE username = ? OR email = ?`,
          [username, email]
        );

        if (existingUsers.length > 0) {
          return res.status(400).json({
            message: existingUsers.some((u: any) => u.username === username)
              ? "Username already exists"
              : "Email already exists",
          });
        }

        // Insert user
        const [userResult]: any = await connection.query(
          `INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)`,
          [username, email, hashedPassword, userType]
        );
        const userId = userResult.insertId;

        // Insert employer
        const [employerResult]: any = await connection.query(
          `INSERT INTO employers
          (user_id, industry_id, state_id, company_name, address, logo, phonenumber, employer_email, aboutCompany)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            industry_id || null,
            state_id || null,
            company_name,
            address || null,
            logoPath,
            phonenumber || null,
            employer_email,
            aboutCompany || null,
          ]
        );
        const employerId = employerResult.insertId;

        // Link user to employer
        await connection.query(`INSERT INTO user_employers (user_id, employer_id) VALUES (?, ?)`, [
          userId,
          employerId,
        ]);

        await connection.commit();
        return res.status(201).json({ message: "Employer registered successfully", employerId });
      } catch (error: any) {
        await connection.rollback();
        console.error("DB error:", error);
        return res.status(500).json({ message: "Database error" });
      } finally {
        connection.release();
      }
    } catch (hashError: any) {
      console.error("Hash error:", hashError);
      return res.status(500).json({ message: "Failed to hash password" });
    }
  });
}
