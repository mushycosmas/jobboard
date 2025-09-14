import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { employerId } = req.query;
  if (!employerId || typeof employerId !== "string") {
    return res.status(400).json({ error: "Employer ID is required" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "File parsing failed" });
    }

    // In formidable v3+, files.logo is a File object or array of Files
    const uploadedFile = Array.isArray(files.logo) ? files.logo[0] : files.logo;
    const file = uploadedFile as File;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded or invalid file" });
    }

    const filename = path.basename(file.filepath); // this is safe now
    const destPath = path.join(process.cwd(), "public/uploads", filename);

    try {
      // Ensure file is moved to final path
      fs.renameSync(file.filepath, destPath);

      // Save filename to DB
      const query = `UPDATE employers SET logo = ? WHERE id = ?`;
      await db.query(query, [filename, employerId]);

      return res.status(200).json({ success: true, logoPath: `/uploads/${filename}` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to save logo" });
    }
  });
}
