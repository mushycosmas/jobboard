export interface PositionLevel {
  id?: number;
  position_name: string;
}

export const getPositionLevels = async (): Promise<PositionLevel[]> => {
  const res = await fetch("/api/position-levels");
  return res.json();
};

export const addPositionLevel = async (payload: PositionLevel) => {
  const res = await fetch("/api/position-levels", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updatePositionLevel = async (id: number, payload: PositionLevel) => {
  const res = await fetch(`/api/position-levels/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deletePositionLevel = async (id: number) => {
  const res = await fetch(`/api/position-levels/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
