"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Container } from "react-bootstrap";
import JobSavedTable from "./JobSavedTable";
import { useSession } from "next-auth/react";

export interface SavedJobData {
  id: number;
  job_id: number;
  job_title: string;
  slug: string;
  posting_date: string;
  expired_date: string;
}

const SavedJobsComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const [savedJobs, setSavedJobs] = useState<SavedJobData[]>([]);
  const [loading, setLoading] = useState(false);
  const applicantId = session?.user?.applicantId?.toString() || null;

  // Fetch saved jobs automatically
  const fetchSavedJobs = async () => {
    if (!applicantId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/applicant/job/saved-jobs/${applicantId}`);
      if (!res.ok) throw new Error("Failed to fetch saved jobs");
      const data = await res.json();
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedJobs();
    }
  }, [applicantId, status]);

  const handleDelete = async (id: number) => {
    if (!applicantId) return;
    if (!confirm("Are you sure you want to remove this saved job?")) return;

    try {
      const res = await fetch(`/api/applicant/job/saved-jobs/${applicantId}?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete saved job");
      fetchSavedJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete saved job");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to view saved jobs.</div>;

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h5 className="mb-0">Saved Jobs</h5>
        </Card.Header>
        <Card.Body>
          {savedJobs.length > 0 ? (
            <JobSavedTable jobs={savedJobs} onDelete={handleDelete} formatDate={formatDate} />
          ) : (
            <p className="text-muted">{loading ? "Loading saved jobs..." : "No saved jobs found."}</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SavedJobsComponent;
