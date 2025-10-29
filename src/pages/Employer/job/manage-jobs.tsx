"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, Button, Dropdown, Form } from "react-bootstrap";
import JobList from "@/components/Job/JobList";
import JobForm from "@/components/Job/JobForm";
import useJobs, { Job } from "@/hooks/useJobs";

type JobStatus = "all" | "active" | "expired";

interface JobManagerProps {
  employerId?: string | null; // from session (for employer)
  layout: React.ComponentType<{ children: React.ReactNode }>;
  baseUrl: string; // e.g. "/employer/job/manage-jobs"
  showEmployerFilter?: boolean; // for admin
}

const JobManager: React.FC<JobManagerProps> = ({
  employerId,
  layout: Layout,
  baseUrl,
  showEmployerFilter = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { jobs, fetchJobs, addJob, updateJob, deleteJob } = useJobs();

  const [modalShow, setModalShow] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editJobData, setEditJobData] = useState<Job | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>("all");
  const [loading, setLoading] = useState(false);
  const [jobCounts, setJobCounts] = useState({ active: 0, expired: 0, all: 0 });
  const [employerList, setEmployerList] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(employerId || null);

  // ✅ Load initial job status from query params
  useEffect(() => {
    const statusParam = (searchParams.get("status") as JobStatus) || "all";
    setJobStatus(statusParam);
  }, [searchParams.toString()]);

  // ✅ Fetch employer list (for admin)
  useEffect(() => {
    if (showEmployerFilter) {
      fetch("/api/employers") // <-- You need this endpoint to return all employers
        .then((res) => res.json())
        .then((data) => setEmployerList(data))
        .catch((err) => console.error("Error loading employers:", err));
    }
  }, [showEmployerFilter]);

  // ✅ Fetch jobs when employerId or jobStatus changes
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await fetchJobs(jobStatus, selectedEmployer || undefined);
      await fetchJobCounts();
      setLoading(false);
    };
    fetchAllData();
  }, [selectedEmployer, jobStatus]);

  // ✅ Count jobs
  const fetchJobCounts = async () => {
    try {
      const endpoint = selectedEmployer
        ? `/api/job/counts/${selectedEmployer}`
        : `/api/job/counts`; // admin all jobs
      const res = await fetch(endpoint);
      const data = await res.json();
      setJobCounts({
        all: data.totalJobs || 0,
        active: data.activeJobs || 0,
        expired: (data.totalJobs || 0) - (data.activeJobs || 0),
      });
    } catch (err) {
      console.error("Error fetching job counts:", err);
    }
  };

  const handleStatusChange = (status: JobStatus) => {
    setJobStatus(status);
    router.push(`${baseUrl}?status=${status}`);
  };

  const handleSaveJob = async (jobData: Partial<Job>) => {
    const targetEmployer = selectedEmployer || employerId;
    if (!targetEmployer) return;

    if (editJobData) {
      await updateJob({ ...editJobData, ...jobData });
    } else {
      await addJob({ ...jobData, employer_id: targetEmployer });
    }

    setModalShow(false);
    await fetchJobs(jobStatus, targetEmployer);
    await fetchJobCounts();
  };

  return (
    <Layout>
      <div className="content">
        <h2>Manage Jobs</h2>

        <div className="d-flex align-items-center mb-3">
          <Button variant="primary" onClick={() => setModalShow(true)} className="me-3">
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

          {/* ✅ Only show for admin */}
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
                <option key={emp.id} value={emp.id}>
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
            jobs={jobs}
            onDelete={deleteJob}
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

        {/* ✅ Create/Edit Modal */}
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

        {/* ✅ View Modal */}
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
    </Layout>
  );
};

export default JobManager;
