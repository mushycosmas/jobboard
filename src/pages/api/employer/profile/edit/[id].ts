import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";

// Disable default body parser (required for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

interface EmployerProfile {
  id: number;
  company_name?: string;
  logo?: string;
  address?: string;
  phonenumber?: string;
  company_size?: string;
  employer_email?: string;
  aboutCompany?: string;
  website?: string;
  region_name?: string;
  industry_name?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ MUST match [id].ts
  const { id } = req.query;

  if (!id || Array.isArray(id) || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid employer ID" });
  }

  const employerId = Number(id);

  // ===================== GET EMPLOYER PROFILE =====================
  if (req.method === "GET") {
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        `
        SELECT 
          e.id,
          e.company_name,
          e.logo,
          e.address,
          e.phonenumber,
          e.company_size,
          e.employer_email,
          e.aboutCompany,
          e.website,
          r.name AS region_name,
          i.industry_name,
          e.twitter,
          e.facebook,
          e.linkedin
        FROM employers e
        LEFT JOIN regions r ON e.state_id = r.id
        LEFT JOIN industries i ON e.industry_id = i.id
        WHERE e.id = ?
        LIMIT 1
        `,
        [employerId]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Employer not found" });
      }

      return res.status(200).json(rows[0] as EmployerProfile);
    } catch (error) {
      console.error("GET employer error:", error);
      return res.status(500).json({ message: "Error fetching employer profile" });
    }
  }

  // ===================== UPDATE EMPLOYER PROFILE =====================
  if (req.method === "PUT") {
    try {
      const uploadDir = path.join(process.cwd(), "public/uploads");

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const form = formidable({
        uploadDir,
        keepExtensions: true,
        multiples: false,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return res.status(500).json({ message: "Error parsing form data" });
        }

        const {
          company_name,
          address,
          phonenumber,
          company_size,
          employer_email,
          aboutCompany,
          website,
          twitter,
          facebook,
          linkedin,
        } = fields as Record<string, string>;

        let logo: string | null = null;

        if (files.logo) {
          const file = Array.isArray(files.logo)
            ? files.logo[0]
            : (files.logo as File);

          logo = path.basename(file.filepath);
        }

        // Update employer
        await db.query(
          `
          UPDATE employers SET
            company_name   = ?,
            address        = ?,
            phonenumber    = ?,
            company_size   = ?,
            employer_email = ?,
            aboutCompany   = ?,
            website        = ?,
            twitter        = ?,
            facebook       = ?,
            linkedin       = ?,
            logo           = COALESCE(?, logo)
          WHERE id = ?
          `,
          [
            company_name,
            address,
            phonenumber,
            company_size,
            employer_email,
            aboutCompany,
            website,
            twitter,
            facebook,
            linkedin,
            logo,
            employerId,
          ]
        );

        // Fetch updated profile
        const [updated] = await db.query<RowDataPacket[]>(
          `
          SELECT 
            e.id,
            e.company_name,
            e.logo,
            e.address,
            e.phonenumber,
            e.company_size,
            e.employer_email,
            e.aboutCompany,
            e.website,
            r.name AS region_name,
            i.industry_name,
            e.twitter,
            e.facebook,
            e.linkedin
          FROM employers e
          LEFT JOIN regions r ON e.state_id = r.id
          LEFT JOIN industries i ON e.industry_id = i.id
          WHERE e.id = ?
          LIMIT 1
          `,
          [employerId]
        );

        return res.status(200).json(updated[0]);
      });
    } catch (error) {
      console.error("PUT employer error:", error);
      return res.status(500).json({ message: "Error updating employer profile" });
    }

    return;
  }

  // ===================== METHOD NOT ALLOWED =====================
  return res.status(405).json({ message: "Method not allowed" });
}
