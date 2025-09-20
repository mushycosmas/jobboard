import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface CVData {
  profile: any;
  education: any[];
  experiences: any[];
  languages: any[];
  professionalQualifications: any[];
  skills: any[];
  referees: any[];
  socialMediaLinks: any[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 🔹 Fetch all applicants (basic profile only)
    const [applicants] = await db.query<RowDataPacket[]>(`
      SELECT 
        u.email,
        a.id,
        CONCAT(a.first_name, ' ', a.last_name) AS fullName,
        a.about AS summary,
        a.dob,
        aa.address,
        ap.phone_number AS phone,
        r.name AS region_name,
        c.name AS country_name,
        g.name AS gender,
        m.name AS marital_status
      FROM applicants a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id
      LEFT JOIN applicant_phones ap ON a.id = ap.applicant_id
      LEFT JOIN regions r ON aa.region_id = r.id
      LEFT JOIN countries c ON r.country_id = c.id
      LEFT JOIN genders g ON a.gender_id = g.id
      LEFT JOIN marital_statuses m ON a.marital_id = m.id
    `);

    if (!applicants.length) {
      return res.status(404).json({ message: "No applicants found" });
    }

    // 🔹 Fetch related data for all applicants
    const [educationRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_educations
    `);
    const [experienceRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_experiences
    `);
    const [languageRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_languages
    `);
    const [professionalRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_professionals
    `);
    const [skillRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_skills
    `);
    const [refereeRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_referees
    `);
    const [socialRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_social_medias
    `);

    // 🔹 Group data by applicant
    const candidates: CVData[] = applicants.map((profile) => {
      const applicantId = profile.id;
      return {
        profile,
        education: educationRows.filter((e) => e.applicant_id === applicantId),
        experiences: experienceRows.filter((e) => e.applicant_id === applicantId),
        languages: languageRows.filter((l) => l.applicant_id === applicantId),
        professionalQualifications: professionalRows.filter((p) => p.applicant_id === applicantId),
        skills: skillRows.filter((s) => s.applicant_id === applicantId),
        referees: refereeRows.filter((r) => r.applicant_id === applicantId),
        socialMediaLinks: socialRows.filter((s) => s.applicant_id === applicantId),
      };
    });

    return res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return res.status(500).json({ message: "Error fetching candidates" });
  }
}
