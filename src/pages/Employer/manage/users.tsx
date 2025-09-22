"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import { useSession } from "next-auth/react";

interface User {
  id: number | null;
  username: string;
  email: string;
  password?: string;
  userType: string;
  hide?: number;
}

const EmployerManageUser = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: null,
    username: "",
    email: "",
    password: "default",
    userType: "employer",
  });

  const employerId = session?.user?.employerId;

  const fetchUsers = async () => {
    if (!employerId) return;
    try {
      const res = await fetch(`/api/employer/users?employerId=${employerId}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchUsers();
  }, [status, employerId]);

  const handleShow = () => {
    setNewUser({ id: null, username: "", email: "", password: "default", userType: "employer" });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerId) return;

    try {
      let res;
      if (newUser.id) {
        // Update existing user
        res = await fetch(`/api/employer/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: newUser.id,
            username: newUser.username,
            email: newUser.email,
          }),
        });
      } else {
        // Create new user
        res = await fetch(`/api/employer/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            userType: newUser.userType,
            employerId,
          }),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save user");
      }

      await fetchUsers();
      handleClose();
    } catch (err: any) {
      console.error("Error saving user:", err.message || err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/employer/users?userId=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = (user: User) => {
    setNewUser(user);
    setShowModal(true);
  };

  if (status === "loading") return <EmployerLayout>Loading session...</EmployerLayout>;
  if (status === "unauthenticated") return <EmployerLayout>Please log in to manage users.</EmployerLayout>;

  return (
    <EmployerLayout>
      <div className="content">
        <h2>Manage Users</h2>
        <Button variant="primary" onClick={handleShow}>Add New User</Button>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{ color: user.hide === 0 ? "green" : "red", fontWeight: "bold" }}>
                    {user.hide === 0 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(user.id!)}>
                    Delete
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
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
              <Form.Group controlId="formUserName" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formUserEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {!newUser.id && (
                <Form.Group controlId="formUserPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit">
                {newUser.id ? "Update User" : "Add User"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </EmployerLayout>
  );
};

export default EmployerManageUser;
