export interface Culture {
  id?: number;
  name: string;
  description?: string;
}

export const getCultures = async (): Promise<Culture[]> => {
  const res = await fetch("/api/cultures");
  return res.json();
};

export const addCulture = async (payload: Culture) => {
  const res = await fetch("/api/cultures", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateCulture = async (id: number, payload: Culture) => {
  const res = await fetch(`/api/cultures/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteCulture = async (id: number) => {
  const res = await fetch(`/api/cultures/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
