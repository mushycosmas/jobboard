"use client";

import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import ProfessionalTable from "./ProfessionalTable";
import ProfessionalFormModal from "./ProfessionalFormModal";
import { useSession } from "next-auth/react";

export interface ProfessionalQualification {
  id: number;
  applicant_id?: string;
  country_id?: string;
  institution_id?: string;
  course_id?: string;
  attachment?: string | File;
  started?: string;
  ended?: string;
}

const ProfessionalQualifications: React.FC = () => {
  const [qualifications, setQualifications] = useState<ProfessionalQualification[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editQualification, setEditQualification] = useState<ProfessionalQualification | null>(null);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<ProfessionalQualification>({
    id: 0,
    applicant_id: "",
    country_id: "",
    institution_id: "",
    course_id: "",
    attachment: "",
    started: "",
    ended: "",
  });

  // Set applicantId from session
  useEffect(() => {
    if (status === "authenticated" && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    }
  }, [session, status]);

  // Fetch qualifications for the applicant
  const fetchQualifications = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/professional-qualification/${applicantId}`);
      if (!res.ok) throw new Error("Failed to fetch qualifications");
      const data = await res.json();
      setQualifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (applicantId) fetchQualifications();
  }, [applicantId]);

  const handleAdd = () => {
    if (!applicantId) return;
    setFormData({
      id: 0,
      applicant_id: applicantId,
      country_id: "",
      institution_id: "",
      course_id: "",
      attachment: "",
      started: "",
      ended: "",
    });
    setEditQualification(null);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const qual = qualifications.find(q => q.id === id);
    if (!qual) return;
    setFormData({ ...qual });
    setEditQualification(qual);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this qualification?")) return;
    try {
      const res = await fetch(`/api/applicant/professional-qualification/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete qualification");
      fetchQualifications();
    } catch (err) {
      console.error(err);
    }
  };

const handleSave = async (data: ProfessionalQualification) => {
  if (!applicantId) {
    console.error("Cannot save without applicantId");
    return;
  }

  try {
    const url = editQualification
      ? `/api/applicant/professional-qualification/${editQualification.id}`
      : `/api/applicant/professional-qualification/${applicantId}`;
    const method = editQualification ? "PUT" : "POST";

    const payload = new FormData();

    payload.append("applicant_id", applicantId);

    // Convert IDs to strings explicitly
    payload.append("country_id", data.country_id ? String(data.country_id) : "");
    payload.append("institution_id", data.institution_id ? String(data.institution_id) : "");
    payload.append("course_id", data.course_id ? String(data.course_id) : "");

    if (data.started) payload.append("started", data.started);
    if (data.ended) payload.append("ended", data.ended);
    if (data.attachment instanceof File) payload.append("attachment", data.attachment);

    const res = await fetch(url, { method, body: payload });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(`Failed to save: ${JSON.stringify(errorJson)}`);
    }

    fetchQualifications();
    setShowModal(false);
    setEditQualification(null);
  } catch (err) {
    console.error(err);
  }
};


  if (!applicantId) return <p>Loading applicant info...</p>;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Professional Qualifications</h5>
        <Button variant="primary" onClick={handleAdd}>Add Qualification</Button>
      </Card.Header>
      <Card.Body>
        <ProfessionalTable
          qualifications={qualifications}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card.Body>

      <ProfessionalFormModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditQualification(null); }}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />
    </Card>
  );
};

export default ProfessionalQualifications;
