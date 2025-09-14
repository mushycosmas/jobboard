import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Dashboard stats function
const getDashboardStats = async (employer_id: string) => {
  if (!employer_id) throw new Error("Employer ID is required");

  try {
    const queries = {
      totalJobs: `SELECT COUNT(*) AS count FROM jobs WHERE employer_id = ?`,
      activeJobs: `SELECT COUNT(*) AS count FROM jobs WHERE employer_id = ? AND expired_date > NOW()`,
      totalApplicants: `SELECT COUNT(*) AS count FROM applicant_applications WHERE employer_id = ?`,
      selectedApplicants: `SELECT COUNT(*) AS count FROM applicant_applications WHERE employer_id = ? AND status = 'selected'`,
      totalViews: `SELECT SUM(view) AS count FROM jobs WHERE employer_id = ?`,
      totalJobsPosted: `SELECT COUNT(*) AS count FROM jobs WHERE employer_id = ?`,
      totalCVsSearched: `SELECT COUNT(*) AS count FROM cv_search_logs WHERE employer_id = ?`
    };

    const [
      [totalJobs],
      [activeJobs],
      [totalApplicants],
      [selectedApplicants],
      [totalViews],
      [totalJobsPosted],
      [totalCVsSearched]
    ] = await Promise.all([
      db.query<RowDataPacket[]>(queries.totalJobs, [employer_id]),
      db.query<RowDataPacket[]>(queries.activeJobs, [employer_id]),
      db.query<RowDataPacket[]>(queries.totalApplicants, [employer_id]),
      db.query<RowDataPacket[]>(queries.selectedApplicants, [employer_id]),
      db.query<RowDataPacket[]>(queries.totalViews, [employer_id]),
      db.query<RowDataPacket[]>(queries.totalJobsPosted, [employer_id]),
      db.query<RowDataPacket[]>(queries.totalCVsSearched, [employer_id])
    ]);

    return {
      totalJobs: totalJobs[0]?.count || 0,
      activeJobs: activeJobs[0]?.count || 0,
      totalApplicants: totalApplicants[0]?.count || 0,
      selectedApplicants: selectedApplicants[0]?.count || 0,
      totalViews: totalViews[0]?.count || 0,
      totalJobsPosted: totalJobsPosted[0]?.count || 0,
      totalCVsSearched: totalCVsSearched[0]?.count || 0
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error.message);
    throw new Error("Failed to fetch dashboard stats");
  }
};

// API Route Handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { employerId } = req.query;

  if (!employerId || typeof employerId !== "string") {
    return res.status(400).json({ error: "Employer ID is required" });
  }

  try {
    const stats = await getDashboardStats(employerId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
}
