"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import JobList from "@/components/Job/JobList";
import JobForm from "@/components/Job/JobForm";
import { Modal, Button, Dropdown } from "react-bootstrap";
import useJobs, { Job } from "@/hooks/useJobs";

type JobStatus = "all" | "active" | "expired";

const JobManagement: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const { jobs, fetchJobs, addJob, updateJob, deleteJob } = useJobs();

  const [employerId, setEmployerId] = useState<string | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editJobData, setEditJobData] = useState<Job | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>("all");
  const [loading, setLoading] = useState(false);
  const [jobCounts, setJobCounts] = useState({ active: 0, expired: 0, all: 0 });

  // Load employerId from session
  useEffect(() => {
    if (session?.user?.employerId) setEmployerId(session.user.employerId);
  }, [session]);

  // Sync status from URL
  useEffect(() => {
    const statusParam = (searchParams.get("status") as JobStatus) || "all";
    setJobStatus(statusParam);
  }, [searchParams.toString()]);

  // Fetch jobs and counts whenever employerId or jobStatus changes
  useEffect(() => {
    if (!employerId) return;

    const fetchAllData = async () => {
      setLoading(true);
      await fetchJobs(jobStatus, employerId);
      await fetchJobCounts();
      setLoading(false);
    };
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerId, jobStatus]);

const fetchJobCounts = async () => {
  if (!employerId) return;
  try {
    const res = await fetch(`/api/job/counts/${employerId}`);
    const data = await res.json();

    setJobCounts({
      all: data.totalJobs || 0,
      active: data.activeJobs || 0,
      expired: data.totalJobs - data.activeJobs || 0, // or compute based on your logic
    });
  } catch (err) {
    console.error("Error fetching job counts:", err);
  }
};


  // Modal handlers
  const handleCreateJob = () => {
    setEditJobData(null);
    setModalShow(true);
  };

  const handleEditJob = (job: Job) => {
    setEditJobData(job);
    setModalShow(true);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setModalView(true);
  };

  const closeModal = () => setModalView(false);

  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (!employerId) return;

    if (editJobData) {
      await updateJob({ ...editJobData, ...jobData });
    } else {
      await addJob({ ...jobData, employer_id: employerId });
    }

    setModalShow(false);
    await fetchJobs(jobStatus, employerId);
    await fetchJobCounts();
  };

  const handleDeleteJob = async (jobId: number | string) => {
    if (!employerId) return;
    await deleteJob(jobId);
    await fetchJobs(jobStatus, employerId);
    await fetchJobCounts();
  };

  const handleStatusChange = (status: JobStatus) => {
    setJobStatus(status);
    router.push(`/employer/job/manage-jobs?status=${status}`);
  };

  if (!session || !employerId) {
    return (
      <EmployerLayout>
        <div className="content">Loading session...</div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="content">
        <h2>Manage Jobs</h2>

        <div className="d-flex align-items-center mb-3">
          <Button variant="primary" onClick={handleCreateJob} className="me-3">
            Create Job
          </Button>

          <Dropdown className="m-1">
            <Dropdown.Toggle variant="secondary">
              {jobStatus === "all"
                ? "All Jobs"
                : jobStatus === "active"
                ? "Active Jobs"
                : "Expired Jobs"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusChange("all")}>
                All Jobs ({jobCounts.all})
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange("active")}>
                Active Jobs ({jobCounts.active})
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange("expired")}>
                Expired Jobs ({jobCounts.expired})
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <JobList
            jobs={jobs}
            onDelete={handleDeleteJob}
            onEdit={handleEditJob}
            onView={handleViewJob}
          />
        )}

        {/* Job Form Modal */}
        <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editJobData ? "Edit Job" : "Create Job"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JobForm
              onSubmit={handleSaveJob}
              initialData={editJobData}
              setModalShow={setModalShow}
              fetchJobs={() => fetchJobs(jobStatus, employerId)}
            />
          </Modal.Body>
        </Modal>

        {/* Job View Modal */}
        <Modal show={modalView} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Job Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedJob ? (
              <div>
                <h5>{selectedJob.title}</h5>
                <p>{selectedJob.description}</p>
                <p>
                  <strong>Salary:</strong> {selectedJob.salary_from} - {selectedJob.salary_to}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.region}, {selectedJob.state}, {selectedJob.country}
                </p>
              </div>
            ) : (
              <p>No job selected.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </EmployerLayout>
  );
};

export default JobManagement;
