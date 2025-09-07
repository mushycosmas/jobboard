"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { UniversalDataContext } from "@/context/UniversalDataContext";

import { Qualification } from "./types";
import QualificationFormModal from "./QualificationFormModal";
import QualificationTable from "./QualificationTable";

const AcademicQualification: React.FC = () => {
  const { data: session, status } = useSession();
  const { categories } = useContext(UniversalDataContext);

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editQualification, setEditQualification] = useState<Qualification | null>(null);
  const [applicantId, setApplicantId] = useState<string>("");

  // Set applicantId from session
  useEffect(() => {
    if (status === "authenticated" && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    }
  }, [session, status]);

  // Fetch all qualifications
  const fetchQualifications = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/academic-qualification/${applicantId}`);
      if (!res.ok) throw new Error("Failed to fetch qualifications");
      const data: Qualification[] = await res.json();
      setQualifications(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Refresh qualifications when applicantId is ready
  useEffect(() => {
    fetchQualifications();
  }, [applicantId]);

  // Save or update a qualification
  const handleSave = async (data: Qualification) => {
    try {
      const payload = {
        education_level_id: Number(data.education_level_id),
        category_id: Number(data.category_id),
        programme_id: data.programme_id ? Number(data.programme_id) : null,
        institution_id: data.institution_id ? Number(data.institution_id) : null,
        country_id: Number(data.country_id),
        started: data.started,
        ended: data.ended,
      };

      const url = data.id
        ? `/api/applicant/academic-qualification/qualification/${data.id}`
        : `/api/applicant/academic-qualification/${applicantId}`;
      const method = data.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save qualification");

      // Refresh table
      await fetchQualifications();

      setShowModal(false);
      setEditQualification(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save qualification.");
    }
  };

  // Open modal for editing
  const handleEdit = (id: number) => {
    const qualification = qualifications.find((q) => q.id === id);
    if (!qualification) return;
    setEditQualification(qualification);
    setShowModal(true);
  };

  // Delete qualification
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this qualification?")) return;
    try {
      const res = await fetch(`/api/applicant/academic-qualification/qualification/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      // Refresh table
      await fetchQualifications();
    } catch (err) {
      console.error(err);
      alert("Failed to delete qualification.");
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage your qualifications.</div>;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Academic Qualifications</h5>
        <Button
          variant="primary"
          onClick={() => {
            setEditQualification(null);
            setShowModal(true);
          }}
        >
          Add Qualification
        </Button>
      </Card.Header>

      <Card.Body>
        <QualificationTable
          qualifications={qualifications}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card.Body>

      {showModal && (
        <QualificationFormModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setEditQualification(null);
          }}
          onSave={handleSave}
          qualification={editQualification}
          applicant_id={applicantId}
        />
      )}
    </Card>
  );
};

export default AcademicQualification;
