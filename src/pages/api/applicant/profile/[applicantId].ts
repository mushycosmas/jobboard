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
  positions: any[];
}

// Safe date formatting
function formatDate(date?: string | Date | null) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
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
    const [profileRows] = await db.query<RowDataPacket[]>(`
      SELECT 
        u.email,
        a.id,
        a.first_name,
        a.last_name,
        CONCAT(a.first_name, ' ', a.last_name) AS fullName,
        a.about AS summary,
        a.dob,
        (SELECT address FROM applicant_addresses WHERE applicant_id = a.id LIMIT 1) AS address,
        (SELECT phone_number FROM applicant_phones WHERE applicant_id = a.id LIMIT 1) AS phone,
        (SELECT r.name FROM regions r 
          JOIN applicant_addresses aa ON r.id = aa.region_id 
          WHERE aa.applicant_id = a.id LIMIT 1) AS region_name,
        (SELECT c.name FROM countries c 
          JOIN regions r ON c.id = r.country_id
          JOIN applicant_addresses aa ON r.id = aa.region_id 
          WHERE aa.applicant_id = a.id LIMIT 1) AS country_name,
        (SELECT name FROM genders WHERE id = a.gender_id) AS gender,
        (SELECT name FROM marital_statuses WHERE id = a.marital_id) AS marital_status,
        a.logo
      FROM applicants a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [applicantIdNum]);

    if (!profileRows.length) return res.status(404).json({ message: "Applicant not found" });

    const profile = profileRows[0];
    profile.dob = formatDate(profile.dob);

    // 🔹 Education
    const [educationRows] = await db.query<RowDataPacket[]>(`
      SELECT ae.*, el.education_level, p.name AS programme_name, i.name AS institution_name
      FROM applicant_educations ae
      LEFT JOIN education_levels el ON ae.education_level_id = el.id
      LEFT JOIN programmes p ON ae.programme_id = p.id
      LEFT JOIN institutions i ON ae.institution_id = i.id
      WHERE ae.applicant_id = ?
    `, [applicantIdNum]);
    const education = educationRows.map(e => ({ ...e, started: formatDate(e.started), ended: formatDate(e.ended) }));

    // 🔹 Experiences
    const [experienceRows] = await db.query<RowDataPacket[]>(`
      SELECT ae.*, i.name AS institution_name
      FROM applicant_experiences ae
      LEFT JOIN institutions i ON ae.institution_id = i.id
      WHERE ae.applicant_id = ?
    `, [applicantIdNum]);
    const experiences = experienceRows.map(exp => ({ ...exp, from: formatDate(exp.from), to: formatDate(exp.to) }));

    // 🔹 Languages
    const [languageRows] = await db.query<RowDataPacket[]>(`
      SELECT al.*, l.name AS language_name,
        lr.name AS read_level,
        lw.name AS write_level,
        ls.name AS speak_level
      FROM applicant_languages al
      LEFT JOIN languages l ON al.language_id = l.id
      LEFT JOIN language_reads lr ON al.read_id = lr.id
      LEFT JOIN language_writes lw ON al.write_id = lw.id
      LEFT JOIN language_speaks ls ON al.speak_id = ls.id
      WHERE al.applicant_id = ?
    `, [applicantIdNum]);

    // 🔹 Professional Qualifications
    const [professionalRows] = await db.query<RowDataPacket[]>(`
      SELECT ap.*, i.name AS institution_name
      FROM applicant_professionals ap
      LEFT JOIN institutions i ON ap.institution_id = i.id
      WHERE ap.applicant_id = ?
    `, [applicantIdNum]);
    const professionalQualifications = professionalRows.map(p => ({ ...p, obtained_date: formatDate(p.obtained_date) }));

    // 🔹 Skills
    const [skillRows] = await db.query<RowDataPacket[]>(`
      SELECT askill.*, s.skill_name
      FROM applicant_skills askill
      LEFT JOIN skills s ON askill.skill_id = s.id
      WHERE askill.applicant_id = ?
    `, [applicantIdNum]);

    // 🔹 Referees
    const [refereeRows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM applicant_referees WHERE applicant_id = ?
    `, [applicantIdNum]);

    // 🔹 Social Media
    const [socialRows] = await db.query<RowDataPacket[]>(`
      SELECT asm.*, sm.name AS platform_name
      FROM applicant_social_medias asm
      LEFT JOIN social_medias sm ON asm.social_media_id = sm.id
      WHERE asm.applicant_id = ?
    `, [applicantIdNum]);

    // 🔹 Positions
    const [positionRows] = await db.query<RowDataPacket[]>(`SELECT * FROM positions`);

    // ✅ Combine all
    const applicantData: CVData = {
      profile,
      education,
      experiences,
      languages: languageRows.map(l => ({ ...l, read: l.read_level, write: l.write_level, speak: l.speak_level })),
      professionalQualifications,
      skills: skillRows,
      referees: refereeRows,
      socialMediaLinks: socialRows.map(s => ({ ...s, platform: s.platform_name })),
      positions: positionRows,
    };

    return res.status(200).json(applicantData);
  } catch (error) {
    console.error("Error fetching applicant data:", error);
    return res.status(500).json({ message: "Error fetching applicant data" });
  }
}
