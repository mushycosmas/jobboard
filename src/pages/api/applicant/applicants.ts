// pages/api/applicant/applicants.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db"; // Make sure you have a database connection file
import { getApplicantsWithDetails } from "@/lib/applicants"; // Your function

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { page = "1", limit = "10", ...filters } = req.query;

    // Convert page & limit to numbers
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;

    // Fetch applicants using your helper
    const applicants = await getApplicantsWithDetails(pageNum, pageSize, filters);

    // Optionally, get total count for pagination
    const [totalCountResult] = await db.query(
      `SELECT COUNT(*) as total FROM applicants a
       LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN regions r ON aa.region_id = r.id
       WHERE 1=1 ${buildFilterWhereClause(filters)}`, // Helper function to build WHERE
      Object.values(filters)
    );
    const totalRecords = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({
      applicants,
      page: pageNum,
      totalPages,
    });
  } catch (error: any) {
    console.error("Error in applicants API:", error);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
}

// Helper to generate WHERE clause for total count
function buildFilterWhereClause(filters: Record<string, any>) {
  const conditions: string[] = [];
  const keys = Object.keys(filters);
  if (filters.country_id) conditions.push(`r.country_id = ${filters.country_id}`);
  if (filters.region_id) conditions.push(`aa.region_id = ${filters.region_id}`);
  if (filters.gender_id) conditions.push(`a.gender_id = ${filters.gender_id}`);
  if (filters.marital_id) conditions.push(`a.marital_id = ${filters.marital_id}`);
  if (filters.first_name) conditions.push(`a.first_name LIKE '%${filters.first_name}%'`);
  if (filters.last_name) conditions.push(`a.last_name LIKE '%${filters.last_name}%'`);
  if (filters.email) conditions.push(`u.email LIKE '%${filters.email}%'`);
  if (conditions.length > 0) return " AND " + conditions.join(" AND ");
  return "";
}
