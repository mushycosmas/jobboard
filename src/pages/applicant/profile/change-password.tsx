"use client";

import { useState } from "react";
import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
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
      console.log("Sending payload:", payload); // Debug

      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change password");
      }

      setMessage("Password changed successfully");
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicantLayout>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" variant="primary" />}
      <PasswordChangeForm onSubmit={handlePasswordChange} />
    </ApplicantLayout>
  );
}
