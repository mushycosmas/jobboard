"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import AdminLayout from "../../../layouts/AdminLayout";

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  hide?: number; // 0 = active, 1 = inactive
  userType: "admin" | "employer" | "user";
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({ username: "", email: "", password: "", userType: "user" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching users.");
    }
  };

  // Initial fetch + fallback auto-refresh every 5s
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleShow = () => {
    setNewUser({ username: "", email: "", password: "123456", userType: "user" });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newUser.username || !newUser.email) return setError("All fields are required.");
    if (!newUser.id && !newUser.password) return setError("Password is required for new users.");

    try {
      setSaving(true);
      const method = newUser.id ? "PUT" : "POST";
      const url = newUser.id ? `/api/users/${newUser.id}` : "/api/users";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save user");

      // Merge updated user or add new one
      setUsers(prev => {
        if (newUser.id) {
          return prev.map(u => (u.id === data.id ? { ...u, ...data } : u));
        } else {
          return [...prev, data];
        }
      });

      handleClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error saving user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting user.");
    }
  };

  const handleEdit = (user: User) => {
    setNewUser({ ...user, password: "" }); // clear password when editing
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content">
        <h2>Manage Users</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" onClick={handleShow} className="mb-3">
          Add New User
        </Button>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td style={{ color: user.hide === 0 ? "green" : "red", fontWeight: "bold" }}>
                  {user.hide === 0 ? "Active" : "Inactive"}
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)} className="me-2">
                    Delete
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{newUser.id ? "Edit User" : "Add New User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>User Type</Form.Label>
                <Form.Select name="userType" value={newUser.userType} onChange={handleChange} required>
                  <option value="user">User</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              {!newUser.id && (
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    placeholder="Enter password or use default"
                    required
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : newUser.id ? "Update User" : "Add User"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
