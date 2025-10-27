export interface Category {
  id?: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories");
  return res.json();
};

export const addCategory = async (payload: Category) => {
  const res = await fetch("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateCategory = async (id: number, payload: Category) => {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteCategory = async (id: number) => {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
