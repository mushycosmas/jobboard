import { db } from "./db"; // Your DB connection

export const getApplicantsWithDetails = async (
  page = 1,
  pageSize = 10,
  filters: Record<string, any> = {}
) => {
  const offset = (page - 1) * pageSize;

  let query = `
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
  `;

  const filterConditions: string[] = [];
  const queryParams: any[] = [];

  if (filters.country_id) {
    filterConditions.push("r.country_id = ?");
    queryParams.push(filters.country_id);
  }
  if (filters.region_id) {
    filterConditions.push("aa.region_id = ?");
    queryParams.push(filters.region_id);
  }
  if (filters.marital_id) {
    filterConditions.push("a.marital_id = ?");
    queryParams.push(filters.marital_id);
  }
  if (filters.gender_id) {
    filterConditions.push("a.gender_id = ?");
    queryParams.push(filters.gender_id);
  }
  if (filters.first_name) {
    filterConditions.push("a.first_name LIKE ?");
    queryParams.push(`%${filters.first_name}%`);
  }
  if (filters.last_name) {
    filterConditions.push("a.last_name LIKE ?");
    queryParams.push(`%${filters.last_name}%`);
  }
  if (filters.email) {
    filterConditions.push("u.email LIKE ?");
    queryParams.push(`%${filters.email}%`);
  }

  if (filterConditions.length > 0) {
    query += " WHERE " + filterConditions.join(" AND ");
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(pageSize, offset);

  const [rows] = await db.query(query, queryParams);
  return rows;
};
