import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/db';
import { RowDataPacket } from 'mysql2';

// Get all qualifications for an applicant by applicant ID
async function getQualificationsByApplicantId(applicantId: string) {
  const query = `
    SELECT 
      countries.name AS country,
      countries.id AS country_id,
      institutions.name AS institution,
      education_levels.education_level AS education_level,
      programmes.name AS programme,
      applicant_educations.id AS id,
      applicant_educations.started AS started,
      applicant_educations.ended AS ended,
      applicant_educations.attachment AS attachment,
      applicant_educations.education_level_id AS education_level_id,
      applicant_educations.category_id AS category_id,
      applicant_educations.programme_id AS programme_id,
      applicant_educations.institution_id AS institution_id
    FROM applicant_educations
    JOIN programmes ON applicant_educations.programme_id = programmes.id
    JOIN countries ON applicant_educations.country_id = countries.id
    JOIN institutions ON applicant_educations.institution_id = institutions.id
    JOIN education_levels ON applicant_educations.education_level_id = education_levels.id
    WHERE applicant_educations.applicant_id = ?;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [applicantId]);
  return rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID must be a string' });
  }

  if (req.method === 'GET') {
    // 🔍 Get all qualifications for applicant
    try {
      const qualifications = await getQualificationsByApplicantId(id);
      return res.status(200).json(qualifications);
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    // ❌ Delete a qualification by its ID
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'Qualification ID must be numeric' });
    }

    try {
      const deleteQuery = `DELETE FROM applicant_educations WHERE id = ?`;
      const [result] = await db.execute(deleteQuery, [id]);

      return res.status(200).json({ message: 'Qualification deleted successfully' });
    } catch (error) {
      console.error('DELETE error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    // ➕ Add new qualification for applicant
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'Applicant ID must be numeric' });
    }

    const {
      education_level_id,
      category_id,
      programme_id,
      institution_id,
      country_id,
      started,
      ended,
    } = req.body;

    try {
      const insertQuery = `
        INSERT INTO applicant_educations (
          applicant_id,
          education_level_id,
          category_id,
          programme_id,
          institution_id,
          country_id,
          started,
          ended,
          attachment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL);
      `;

      const [result]: any = await db.execute(insertQuery, [
        id,
        education_level_id || null,
        category_id || null,
        programme_id || null,
        institution_id || null,
        country_id || null,
        started || null,
        ended || null,
      ]);

      return res.status(201).json({
        message: 'Qualification created successfully',
        id: result.insertId,
      });
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // ❌ Unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
