"use client";

import React, { useState } from "react";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import AdminLayout from "../../../layouts/AdminLayout";
import { useSession } from "next-auth/react";

const ChangePassword: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // session.user.id must exist

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId) return setError("User not authenticated.");
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (newPassword !== confirmPassword) {
      return setError("New password and confirmation do not match.");
    }

    try {
      setSaving(true);

      const response = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display error message returned from backend
        return setError(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(err.message || "Error changing password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header>
            <h4>Change Password</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="currentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ChangePassword;
