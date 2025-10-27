export interface Experience {
  id?: number;
  name: string;
  years_min?: number | null;
  years_max?: number | null;
}

export const getExperiences = async (): Promise<Experience[]> => {
  const res = await fetch("/api/experiences");
  return res.json();
};

export const addExperience = async (payload: Experience) => {
  const res = await fetch("/api/experiences", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateExperience = async (id: number, payload: Experience) => {
  const res = await fetch(`/api/experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteExperience = async (id: number) => {
  const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
  return res.json();
};
