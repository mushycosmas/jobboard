import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import formidable from "formidable";
import path from "path";

// Disable default body parser for file uploads
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
  const { employerId } = req.query;

  if (!employerId || Array.isArray(employerId) || isNaN(Number(employerId))) {
    return res.status(400).json({ message: "Invalid employer ID" });
  }

  const employerIdNum = Number(employerId);

  // ---------------- GET METHOD ----------------
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
          r.name as region_name,
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
        [employerIdNum]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Employer not found" });
      }

      const employer: EmployerProfile = rows[0] as EmployerProfile;
      return res.status(200).json(employer);
    } catch (error) {
      console.error("Error fetching employer profile:", error);
      return res.status(500).json({ message: "Error fetching employer profile" });
    }
  }

  // ---------------- PUT METHOD ----------------
  if (req.method === "PUT") {
    try {
      const form = formidable({
        uploadDir: path.join(process.cwd(), "/public/uploads"),
        keepExtensions: true,
        multiples: false,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error parsing form" });
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
        } = fields as any;

        let logoFilename = undefined;
        if (files.logo) {
          const file = Array.isArray(files.logo) ? files.logo[0] : files.logo;
          logoFilename = path.basename(file.filepath);
        }

        // Update employer in DB
        await db.query(
          `
          UPDATE employers SET
            company_name = ?,
            address = ?,
            phonenumber = ?,
            company_size = ?,
            employer_email = ?,
            aboutCompany = ?,
            website = ?,
            twitter = ?,
            facebook = ?,
            linkedin = ?,
            logo = COALESCE(?, logo)
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
            logoFilename,
            employerIdNum,
          ]
        );

        // Fetch updated record
        const [updatedRows] = await db.query<RowDataPacket[]>(
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
            r.name as region_name,
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
          [employerIdNum]
        );

        return res.status(200).json(updatedRows[0]);
      });
    } catch (error) {
      console.error("Error updating employer profile:", error);
      return res.status(500).json({ message: "Error updating employer profile" });
    }
    return;
  }

  // ---------------- METHOD NOT ALLOWED ----------------
  return res.status(405).json({ message: "Method not allowed" });
}
