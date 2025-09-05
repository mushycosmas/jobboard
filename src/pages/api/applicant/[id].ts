// pages/api/applicant/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';
import { RowDataPacket } from 'mysql2';

// ✅ GET /api/applicant/[id]
async function getApplicantById(applicantId: string) {
  const [applicant] = await db.query<RowDataPacket[]>(
    `
    SELECT 
      u.email,
      a.id,
      a.first_name,
      a.last_name,
      a.about,
      a.logo,
      a.dob,
      a.user_id,
      a.gender_id,
      a.marital_id,
      aa.address,
      ap.phone_number,
      aa.region_id,
      r.name AS region_name,
      r.country_id AS country_id,
      c.name AS country_name
    FROM 
      applicants a
    LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id
    LEFT JOIN users u ON a.user_id = u.id 
    LEFT JOIN regions r ON aa.region_id = r.id
    LEFT JOIN countries c ON r.country_id = c.id
    LEFT JOIN marital_statuses m ON a.marital_id = m.id
    LEFT JOIN genders g ON a.gender_id = g.id
    LEFT JOIN applicant_phones ap ON a.id = ap.applicant_id
    WHERE a.id = ?
    `,
    [applicantId]
  );

  if (!applicant.length) {
    throw new Error('Applicant not found');
  }

  return applicant;
}

// ✅ PUT /api/applicant/[id]
async function updateApplicant(applicantId: string, data: any) {
  const {
    firstName,
    lastName,
    logo,
    dateOfBirth,
    maritalStatus,
    gender,
    about,
    addresses,
    phones,
  } = data;

  // Update main table
  await db.query(
    `
    UPDATE applicants 
    SET 
      first_name = ?, 
      last_name = ?, 
      logo = ?, 
      dob = ?,
      marital_id = ?,
      gender_id = ?,
      about = ?
    WHERE id = ?
    `,
    [
      firstName,
      lastName,
      logo,
      dateOfBirth,
      maritalStatus,
      gender,
      about,
      applicantId,
    ]
  );

  // Update addresses
  if (addresses && Array.isArray(addresses)) {
    for (const address of addresses) {
      if (address.id) {
        await db.query(
          `UPDATE applicant_addresses SET address = ?, region_id = ? WHERE id = ?`,
          [address.address, address.regionId, address.id]
        );
      } else {
        await db.query(
          `INSERT INTO applicant_addresses (applicant_id, address, region_id) VALUES (?, ?, ?)`,
          [applicantId, address.address, address.regionId]
        );
      }
    }
  }

  // Update phones
  if (phones && Array.isArray(phones)) {
    for (const phone of phones) {
      if (phone.id) {
        await db.query(
          `UPDATE applicant_phones SET phone_number = ? WHERE id = ?`,
          [phone.phoneNumber, phone.id]
        );
      } else {
        await db.query(
          `INSERT INTO applicant_phones (applicant_id, phone_number) VALUES (?, ?)`,
          [applicantId, phone.phoneNumber]
        );
      }
    }
  }

  return { success: true };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid applicant ID' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const applicant = await getApplicantById(id);
        return res.status(200).json(applicant);
      }
      case 'PUT': {
        const result = await updateApplicant(id, req.body);
        return res.status(200).json({ message: 'Updated successfully', result });
      }
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res
          .status(405)
          .json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
