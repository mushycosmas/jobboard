import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [results] = await db.query(
      "SELECT id, company_name FROM employers ORDER BY company_name ASC"
    );

    // Return as { employers: [...] } to match frontend
    return res.status(200).json({ employers: results });
  } catch (error: any) {
    console.error("Error fetching employers:", error);
    return res.status(500).json({ error: "Failed to fetch employers", details: error.message });
  }
}
