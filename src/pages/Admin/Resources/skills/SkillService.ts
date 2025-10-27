export interface Skill {
  id?: number;
  skill_name: string;
}

export const getSkills = async (): Promise<Skill[]> => {
  const res = await fetch("/api/skills");
  return res.json();
};

export const addSkill = async (payload: Skill) => {
  const res = await fetch("/api/skills", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateSkill = async (id: number, payload: Skill) => {
  const res = await fetch(`/api/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteSkill = async (id: number) => {
  const res = await fetch(`/api/skills/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
