"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, Button, Dropdown, Form } from "react-bootstrap";
import JobList from "@/components/Job/JobList";
import JobForm from "@/components/Job/JobForm";
import useJobs, { Job } from "@/hooks/useJobs";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { useSession } from "next-auth/react";

type JobStatus = "all" | "active" | "expired";

const JobManager: React.FC<{ showEmployerFilter?: boolean }> = ({
  showEmployerFilter = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { data: session } = useSession();

  const [modalShow, setModalShow] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editJobData, setEditJobData] = useState<Job | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>("all");
  const [loading, setLoading] = useState(false);
  const [jobCounts, setJobCounts] = useState({ all: 0, active: 0, expired: 0 });
  const [employerList, setEmployerList] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null);
  const [jobsData, setJobsData] = useState<Job[]>([]);

  const employerId = session?.user?.employerId ? String(session.user.employerId) : null;

  // Load initial job status from query params
  useEffect(() => {
    if (!searchParams) return;
    const statusParam = (searchParams.get("status") as JobStatus) || "all";
    setJobStatus(statusParam);
  }, [searchParams]);

  // Fetch employer list (for admin)
  useEffect(() => {
    if (!showEmployerFilter) return;
    fetch("/api/employers")
      .then((res) => res.json())
      .then((data) => setEmployerList(data))
      .catch((err) => console.error("Error loading employers:", err));
  }, [showEmployerFilter]);

  // Fetch jobs and counts
  const fetchAllData = async () => {
    if (!employerId) return;
    setLoading(true);
    const targetEmployer = selectedEmployer || employerId;

    try {
      // Fetch jobs
      const resJobs = await fetch(`/api/job/get?status=${jobStatus}&employer_id=${targetEmployer}`);
      const dataJobs = await resJobs.json();
      setJobsData(dataJobs.jobs || []);

      // Fetch counts
      const resCounts = await fetch(`/api/job/counts/${targetEmployer}`);
      const dataCounts = await resCounts.json();
      setJobCounts({
        all: Number(dataCounts.totalJobs) || 0,
        active: Number(dataCounts.activeJobs) || 0,
        expired: (Number(dataCounts.totalJobs) - Number(dataCounts.activeJobs)) || 0,
      });
    } catch (err) {
      console.error("Error fetching jobs or counts:", err);
      setJobCounts({ all: 0, active: 0, expired: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedEmployer, jobStatus, employerId]);

  // Handle status change
  const handleStatusChange = (status: JobStatus) => {
    setJobStatus(status);
    const query = new URLSearchParams();
    query.set("status", status);
    router.replace(`/employer/job/manage-jobs?${query.toString()}`);
  };

  // Handle save (create or edit)
  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (!employerId) return;
    const targetEmployer = selectedEmployer || employerId;

    try {
      if (editJobData) {
        await updateJob({ ...editJobData, ...jobData });
      } else {
        await addJob({ ...jobData, employer_id: targetEmployer });
      }

      setModalShow(false);
      setEditJobData(null);

      // Refresh jobs & counts
      await fetchAllData();
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  // Handle delete
  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      await fetchAllData(); // refresh after deletion
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  if (!employerId) return <div>Please log in as an employer to manage jobs.</div>;

  return (
    <EmployerLayout>
      <div className="content">
        <h2>Manage Jobs</h2>

        <div className="d-flex align-items-center mb-3">
          <Button
            variant="primary"
            onClick={() => setModalShow(true)}
            className="me-3"
          >
            Create Job
          </Button>

          <Dropdown className="me-3">
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

          {showEmployerFilter && (
            <Form.Select
              value={selectedEmployer || ""}
              onChange={(e) =>
                setSelectedEmployer(e.target.value === "" ? null : e.target.value)
              }
              style={{ width: "250px" }}
            >
              <option value="">All Employers</option>
              {employerList.map((emp) => (
                <option key={emp.id} value={String(emp.id)}>
                  {emp.company_name || emp.name}
                </option>
              ))}
            </Form.Select>
          )}
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <JobList
            jobs={jobsData}
            onDelete={handleDeleteJob}
            onEdit={(job) => {
              setEditJobData(job);
              setModalShow(true);
            }}
            onView={(job) => {
              setSelectedJob(job);
              setModalView(true);
            }}
          />
        )}

        {/* Create/Edit Modal */}
        <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editJobData ? "Edit Job" : "Create Job"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JobForm
              onSubmit={handleSaveJob}
              initialData={editJobData}
              setModalShow={setModalShow}
            />
          </Modal.Body>
        </Modal>

        {/* View Modal */}
        <Modal show={modalView} onHide={() => setModalView(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Job Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedJob ? (
              <>
                <h5>{selectedJob.title}</h5>
                <p>{selectedJob.description}</p>
              </>
            ) : (
              <p>No job selected.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </EmployerLayout>
  );
};

export default JobManager;
