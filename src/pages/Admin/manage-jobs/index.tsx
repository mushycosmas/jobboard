"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import DataTable, { TableColumn } from "react-data-table-component";
import AdminLayout from "../../../layouts/AdminLayout";

type Employer = {
  id: number;
  company_name: string;
};

type Job = {
  id: number;
  title: string;
  description: string;
  salary_from: number;
  salary_to: number;
  region_name: string;
  country_name: string;
  status: "active" | "expired";
  employer?: Employer;
};

const AdminManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<"all" | "active" | "expired">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch all employers **/
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await fetch("/api/employer/get");
        if (!res.ok) throw new Error("Failed to fetch employers");
        const data = await res.json();
        setEmployers(data.employers || []);
      } catch (err) {
        console.error("Error fetching employers:", err);
      }
    };
    fetchEmployers();
  }, []);

  /** Fetch jobs based on filters **/
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedEmployer) params.append("employer_id", selectedEmployer);
        if (jobStatus !== "all") params.append("status", jobStatus);

        const res = await fetch(`/api/job/get?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load jobs");

        const data = await res.json();
        setJobs(data.jobs || []);
        setFilteredJobs(data.jobs || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [selectedEmployer, jobStatus]);

  /** Filter jobs by search **/
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const term = searchTerm.trim().toLowerCase();
    const filtered = jobs.filter((job) => {
      const fields = [
        job.title,
        job.description,
        job.region_name,
        job.country_name,
        job.employer?.company_name,
      ]
        .filter(Boolean)
        .map((v) => v!.toLowerCase());

      return fields.some((f) => f.includes(term));
    });

    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  /** Delete job **/
  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/job/delete?id=${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job");

      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setFilteredJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    }
  };

  /** View job details **/
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setModalShow(true);
  };

  /** Define DataTable columns **/
  const columns: TableColumn<Job>[] = useMemo(
    () => [
      { name: "Title", selector: (row) => row.title, sortable: true },
      { name: "Employer", selector: (row) => row.employer?.company_name || "N/A", sortable: true },
      {
        name: "Salary",
        selector: (row) => `${row.salary_from} - ${row.salary_to}`,
        sortable: true,
      },
      {
        name: "Location",
        selector: (row) => `${row.region_name}, ${row.country_name}`,
        sortable: true,
      },
      {
        name: "Status",
        cell: (row) => (
          <span
            className={`badge ${
              row.status === "active" ? "bg-success" : "bg-secondary"
            }`}
          >
            {row.status === "active" ? "Active" : "Expired"}
          </span>
        ),
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex gap-2">
            <OverlayTrigger overlay={<Tooltip>View Job</Tooltip>} placement="top">
              <Button size="sm" variant="info" onClick={() => handleViewJob(row)}>
                <FaEye />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip>Delete Job</Tooltip>} placement="top">
              <Button size="sm" variant="danger" onClick={() => handleDeleteJob(row.id)}>
                <FaTrash />
              </Button>
            </OverlayTrigger>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h3 className="mb-4">Manage All Jobs</h3>

        {/* Filters */}
        <Row className="align-items-center mb-3 g-2">
          <Col md={3}>
            <Form.Select
              value={selectedEmployer}
              onChange={(e) => setSelectedEmployer(e.target.value)}
            >
              <option value="">All Employers</option>
              {employers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.company_name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={jobStatus}
              onChange={(e) => setJobStatus(e.target.value as "all" | "active" | "expired")}
            >
              <option value="all">All Jobs</option>
              <option value="active">Active Jobs</option>
              <option value="expired">Expired Jobs</option>
            </Form.Select>
          </Col>

          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by title, employer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        {/* Data Table */}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredJobs}
            pagination
            highlightOnHover
            striped
            responsive
            noDataComponent="No jobs found."
          />
        )}

        {/* Job Details Modal */}
        <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Job Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedJob ? (
              <>
                <h5>{selectedJob.title}</h5>
                <p>{selectedJob.description}</p>
                <p>
                  <strong>Salary:</strong> {selectedJob.salary_from} - {selectedJob.salary_to}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.region_name}, {selectedJob.country_name}
                </p>
                <p>
                  <strong>Employer:</strong> {selectedJob.employer?.company_name || "N/A"}
                </p>
              </>
            ) : (
              <p>No job selected.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminManageJobs;
