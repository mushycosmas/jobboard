"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import { User, getUserById, updateUser } from "./UserService";
import { useSession } from "next-auth/react";

const UserProfile: React.FC = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(userId);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("No user ID found.");

    try {
      setSaving(true);
      await updateUser(userId, user);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="content text-center p-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading profile...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!session) {
    return (
      <AdminLayout>
        <div className="content text-center p-5">
          <h5>You must be logged in to view this page.</h5>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header>
            <h4>Edit Profile</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                className="mt-2"
              >
                {saving ? "Saving..." : "Update Profile"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserProfile;
