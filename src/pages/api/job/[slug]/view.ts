import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  try {
    const [result]: any = await db.query(
      `UPDATE jobs 
       SET views = COALESCE(views, 0) + 1 
       WHERE slug = ?`,
      [slug]
    );

    // 🔍 DEBUG & SAFETY
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    return res.status(200).json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error('Increment job view error:', error);
    return res.status(500).json({ message: 'Failed to update views' });
  }
}
