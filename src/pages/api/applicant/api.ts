// src/api/api.ts
export interface ApplicantFilters {
  country_id?: string;
  region_id?: string;
  gender_id?: string;
  experience_id?: string;
  marital_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PaginationResponse<T> {
  applicants?: T[];
  page: number;
  totalPages: number;
}

// Fetch all applicants with filters & pagination
export const fetchApplicantsData = async (
  page: number = 1,
  filters: ApplicantFilters = {}
) => {
  const params = new URLSearchParams({ page: page.toString(), ...filters });
  const res = await fetch(`/api/applicant/applicants?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch applicants");
  return res.json();
};

// Fetch total experience for a single applicant
export const fetchTotalExperience = async (applicantId: number | string) => {
  const res = await fetch(`/api/applicant/${applicantId}/experience`);
  if (!res.ok) throw new Error("Failed to fetch total experience");
  return res.json();
};

// Fetch full applicant data
export const fetchApplicantData = async (applicantId: number | string) => {
  const res = await fetch(`/api/applicant/${applicantId}`);
  if (!res.ok) throw new Error("Failed to fetch applicant data");
  return res.json();
};

// Fetch applicant skills
export const fetchSkills = async (applicantId: number | string) => {
  const res = await fetch(`/api/applicant/${applicantId}/skills`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
};

// Fetch applicant social media links
export const fetchSocialMediaLinks = async (applicantId: number | string) => {
  const res = await fetch(`/api/applicant/${applicantId}/social-links`);
  if (!res.ok) throw new Error("Failed to fetch social media links");
  return res.json();
};
