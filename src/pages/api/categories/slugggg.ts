import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // your DB connection, adjust as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug },
    method,
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid slug' });
  }

  try {
    const query = `
      SELECT
        j.*,
        e.company_name,
        e.logo
      FROM jobs j
      LEFT JOIN employers e ON j.employer_id = e.id
      LEFT JOIN job_categories jc ON j.id = jc.job_id
      LEFT JOIN industries i ON jc.category_id = i.id
      WHERE i.slug = ?
    `;

    const [rows] = await db.query(query, [slug]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Category not found or no jobs in this category' });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching jobs by category slug:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
