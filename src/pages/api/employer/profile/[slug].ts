import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // adjust your DB import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required' });
  }

  try {
    const query = `
      SELECT 
        e.id,
        e.company_name,
        e.logo,
        e.industry_id,
        i.industry_name,
        r.name AS region_name,
        e.company_size,
        e.aboutCompany,
        e.website,
        e.linkedin,
        e.twitter,
        e.facebook
      FROM employers e
      LEFT JOIN industries i ON e.industry_id = i.id
      LEFT JOIN regions r ON e.state_id = r.id
      WHERE e.slug = ?
      LIMIT 1
    `;
    const [rows] = await db.query(query, [slug]);
    const employer = (rows as any[])[0];

    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    // Fix logo path for frontend
    if (employer.logo) {
      const logoPath = employer.logo.replace(/\\/g, '/'); // convert backslashes
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      employer.logo = `${baseUrl}/uploads/${logoPath}`;
    }

    return res.status(200).json(employer);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch employer data', details: error.message });
  }
}
