export interface JobType {
  id?: number;
  name: string;
}

export const getJobTypes = async (): Promise<JobType[]> => {
  const res = await fetch("/api/job-types");
  return res.json();
};

export const addJobType = async (payload: JobType) => {
  const res = await fetch("/api/job-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateJobType = async (id: number, payload: JobType) => {
  const res = await fetch(`/api/job-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteJobType = async (id: number) => {
  const res = await fetch(`/api/job-types/${id}`, { method: "DELETE" });
  return res.json();
};
