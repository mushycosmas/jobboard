"use client";

import { useState } from "react";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import PasswordChangeForm from "@/components/Auth/PasswordChangeForm";
import { useSession } from "next-auth/react";
import { Alert, Spinner } from "react-bootstrap";

export default function ApplicantReferees() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to change your password.</div>;

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    const userId = session?.user?.id;

    if (!userId) {
      setError("User not logged in");
      return;
    }

    if (!currentPassword || !newPassword) {
      setError("Both current and new password are required");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = { userId, currentPassword, newPassword };

      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // ✅ No throw here, just set error so no stack trace appears
        setError(data.message || "Failed to change password");
        return;
      }

      setMessage(data.message || "Password changed successfully");
    } catch (err) {
      console.error("Unexpected error changing password:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployerLayout>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" variant="primary" />}
      <PasswordChangeForm onSubmit={handlePasswordChange} />
    </EmployerLayout>
  );
}
