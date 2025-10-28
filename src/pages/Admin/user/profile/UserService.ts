export interface User {
  id?: number;
  username: string;
  email: string;
  phone?: string;
}

/**
 * Fetch a single user by ID
 */
export const getUserById = async (id: number | string): Promise<User> => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
};

/**
 * Create a new user
 */
export const addUser = async (payload: User): Promise<User> => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to create user");
  }
  return res.json();
};

/**
 * Update an existing user
 */
export const updateUser = async (
  id: number | string,
  payload: User
): Promise<User> => {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to update user");
  }
  return res.json();
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (id: number | string): Promise<{ message: string }> => {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  return res.json();
};
