"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import JobApplicationsTable from "./JobApplicationsTable";
import AddJobApplicationModal from "./AddJobApplicationModal";

export interface JobApplicationData {
  id?: number;
  job_id: number;
  applicant_id: number;
  letter: string;
  hide?: boolean;
  status: string; // e.g., "Pending", "Interview", "Rejected", "Hired"
  stage_id?: number;
  created_at: string;
  updated_at?: string;
  job_title: string;
  posting_date?: string;
  expired_date?: string;
}

const JobApplicationsComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<JobApplicationData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplicationData & { id: number } | null>(null);

  const applicantId = session?.user?.applicantId?.toString() || null;

  // Fetch applications
  const fetchApplications = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/job/applications/${applicantId}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching job applications:", err);
      setApplications([]);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications();
    }
  }, [applicantId, status]);

  // Save application (POST or PUT)
  const handleSave = async (data: Partial<JobApplicationData>) => {
    if (!applicantId) return;

    try {
      const url = editingApplication
        ? `/api/applicant/job/applications/${applicantId}?id=${editingApplication.id}`
        : `/api/applicant/job/applications/${applicantId}`;
      const method = editingApplication ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, applicant_id: applicantId }),
      });

      await fetchApplications();
      setShowModal(false);
      setEditingApplication(null);
    } catch (err) {
      console.error("Error saving job application:", err);
    }
  };

  // Edit application
  const handleEdit = (application: JobApplicationData & { id: number }) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  // Delete application
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await fetch(`/api/applicant/job/applications/${applicantId}?id=${id}`, { method: "DELETE" });
      await fetchApplications();
    } catch (err) {
      console.error("Error deleting job application:", err);
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage job applications.</div>;

  return (
    <>
      <Card className="mt-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h5 className="mb-0">Job Applications</h5>
          {/* <Button variant="light" onClick={() => setShowModal(true)}>
            Add Application
          </Button> */}
        </Card.Header>
        <Card.Body>
          <JobApplicationsTable
            applications={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card.Body>
      </Card>

      <AddJobApplicationModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingApplication(null);
        }}
        onSave={handleSave}
        editingApplication={editingApplication}
      />
    </>
  );
};

export default JobApplicationsComponent;
