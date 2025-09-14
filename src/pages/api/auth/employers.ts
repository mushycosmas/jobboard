import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // disable default parser for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).json({ message: "Error parsing form data" });
      }

      const {
        username,
        email,
        password,
        company_name,
        employer_email,
        aboutCompany,
        address,
        state_id,
        phonenumber,
        userType,
        industry_id,
      } = fields;

      if (!username || !email || !password || !company_name || !employer_email) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password as string, 10);

      // Handle logo upload
      let logoPath: string | null = null;
      if (files.logo) {
        const file = Array.isArray(files.logo) ? files.logo[0] : files.logo;
        logoPath = `/uploads/${path.basename(file.filepath)}`;
      }

      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Insert into users table
        const [userResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)`,
          [username, email, hashedPassword, userType || "employer"]
        );
        const userId = userResult.insertId;

        // Insert into employers table
        const [employerResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO employers (user_id, industry_id, state_id, company_name, address, logo, phonenumber, employer_email, aboutCompany)
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

        // Link user and employer
        await connection.query(`INSERT INTO user_employers (user_id, employer_id) VALUES (?, ?)`, [
          userId,
          employerId,
        ]);

        await connection.commit();
        return res.status(201).json({ message: "Employer registered successfully", employerId });
      } catch (error: any) {
        await connection.rollback();
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Failed to register employer", error: error.message });
      } finally {
        connection.release();
      }
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Unexpected server error", error: error.message });
  }
}
