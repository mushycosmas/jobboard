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

  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Invalid applicant ID" });
  }

  try {
    const applicantIdNum = Number(applicantId);

    // 🔹 Profile
    const [profileRows] = await db.query<RowDataPacket[]>(
      `
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
      WHERE a.id = ?`,
      [applicantIdNum]
    );

    if (!profileRows.length) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const profile = profileRows[0];

    // 🔹 Education
    const [educationRows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        ae.id,
        ae.started,
        ae.ended,
        el.education_level,
        p.name AS programme,
        i.name AS institution,
        c.name AS country,
        ae.attachment
      FROM applicant_educations ae
      LEFT JOIN programmes p ON ae.programme_id = p.id
      LEFT JOIN countries c ON ae.country_id = c.id
      LEFT JOIN institutions i ON ae.institution_id = i.id
      LEFT JOIN education_levels el ON ae.education_level_id = el.id
      WHERE ae.applicant_id = ?`,
      [applicantIdNum]
    );

    // 🔹 Experiences
    const [experienceRows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        ae.id, 
        i.name AS institution, 
        p.name AS position, 
        ae.from_date AS \`from\`, 
        ae.to_date AS \`to\`, 
        ae.is_currently_working,
        ae.responsibility AS responsibilities
      FROM applicant_experiences ae
      JOIN institutions i ON ae.institution_id = i.id
      JOIN positions p ON ae.position_id = p.id
      WHERE ae.applicant_id = ?
      ORDER BY ae.from_date DESC`,
      [applicantIdNum]
    );

    // 🔹 Languages
    const [languageRows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        al.id,
        l.name,
        sp.name AS speaking_skill,
        rd.name AS reading_skill,
        rw.name AS writing_skill
      FROM applicant_languages al
      JOIN languages l ON al.language_id = l.id
      LEFT JOIN language_speaks sp ON al.speak_id = sp.id
      LEFT JOIN language_reads rd ON al.read_id = rd.id
      LEFT JOIN language_writes rw ON al.write_id = rw.id
      WHERE al.applicant_id = ?`,
      [applicantIdNum]
    );

    // 🔹 Professional Qualifications
    const [professionalRows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        ap.id,
        ap.started,
        ap.ended,
        c.name AS country,
        i.name AS institution,
        co.name AS course,
        ap.attachment
      FROM applicant_professionals ap
      JOIN countries c ON ap.country_id = c.id
      JOIN institutions i ON ap.institution_id = i.id
      JOIN courses co ON ap.course_id = co.id
      WHERE ap.applicant_id = ?`,
      [applicantIdNum]
    );

    // 🔹 Skills
    const [skillRows] = await db.query<RowDataPacket[]>(
      `
      SELECT s.id, s.skill_name 
      FROM applicant_skills aps
      JOIN skills s ON aps.skill_id = s.id
      WHERE aps.applicant_id = ?`,
      [applicantIdNum]
    );

    // 🔹 Referees
    const [refereeRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM applicant_referees WHERE applicant_id = ?`,
      [applicantIdNum]
    );

    // 🔹 Social Media
    const [socialRows] = await db.query<RowDataPacket[]>(
      `
      SELECT a.id, a.social_media_id, sm.name AS platform, a.url
      FROM applicant_social_medias a
      INNER JOIN social_medias sm ON a.social_media_id = sm.id
      WHERE a.applicant_id = ?`,
      [applicantIdNum]
    );

    // ✅ Combine all sections
    const applicantData: CVData = {
      profile,
      education: educationRows,
      experiences: experienceRows,
      languages: languageRows,
      professionalQualifications: professionalRows,
      skills: skillRows,
      referees: refereeRows,
      socialMediaLinks: socialRows,
    };

    return res.status(200).json(applicantData);
  } catch (error) {
    console.error("Error fetching applicant data:", error);
    return res.status(500).json({ message: "Error fetching applicant data" });
  }
}
