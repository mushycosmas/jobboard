import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import fs from "fs-extra";
import path from "path";
import formidable, { File } from "formidable";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { applicantId } = req.query;

  if (!applicantId || Array.isArray(applicantId)) {
    return res.status(400).json({ message: "Applicant ID is required" });
  }

  const applicantIdNum = Number(applicantId);
  if (isNaN(applicantIdNum)) {
    return res.status(400).json({ message: "Applicant ID must be a number" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const uploadDir = path.join(process.cwd(), "public", "logos");
  await fs.ensureDir(uploadDir);

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "File upload failed", error: err });

    const file = Array.isArray(files.logo) ? files.logo[0] : (files.logo as File | undefined);
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(file.originalFilename || "");
    const newFileName = `logo_${applicantIdNum}${ext}`;
    const newFilePath = path.join(uploadDir, newFileName);

    try {
      await fs.move(file.filepath, newFilePath, { overwrite: true });
      const logoPath = `/logos/${newFileName}`;

      const [existing] = await db.query<RowDataPacket[]>(
        `SELECT id FROM applicants WHERE id = ?`,
        [applicantIdNum]
      );

      if (existing.length === 0) return res.status(404).json({ message: "Applicant not found" });

      await db.query<ResultSetHeader>(
        `UPDATE applicants SET logo = ? WHERE id = ?`,
        [logoPath, applicantIdNum]
      );

      return res.status(200).json({ success: true, logoPath });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to save file", error });
    }
  });
}
