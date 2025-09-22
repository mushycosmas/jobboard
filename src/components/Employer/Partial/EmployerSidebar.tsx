"use client";

import React, { useState, useEffect } from "react";
import { Accordion, Card, Button, Modal } from "react-bootstrap";
import Link from "next/link";
import { useSession } from "next-auth/react";

const EmployerSidebar: React.FC = () => {
  const { data: session } = useSession();
  const [jobCounts, setJobCounts] = useState({ active: 0, expired: 0, all: 0 });
  const [userCount, setUserCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  const employerId = session?.user?.employerId;
  const employerName = session?.user?.employerName;

  useEffect(() => {
    if (!employerId) return;

    // Fetch employer logo
    const fetchEmployerLogo = async () => {
      try {
        const res = await fetch(`/api/employer/logo/${employerId}`);
        const data = await res.json();
        if (data.logo) setLogo(data.logo);
      } catch (err) {
        console.error("Error fetching employer logo:", err);
      }
    };

    // Fetch job counts
    const fetchJobCounts = async () => {
      try {
        const res = await fetch(`/api/job/counts/${employerId}`);
        const data = await res.json();
        setJobCounts({
          all: data.totalJobs || 0,
          active: data.activeJobs || 0,
          expired: (data.totalJobs - data.activeJobs) || 0,
        });
      } catch (err) {
        console.error("Error fetching job counts:", err);
      }
    };

    // Fetch number of users linked to this employer
    const fetchUserCount = async () => {
      try {
        const res = await fetch(`/api/employer/users?employerId=${employerId}`);
        const data = await res.json();
        setUserCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchEmployerLogo();
    fetchJobCounts();
    fetchUserCount();
  }, [employerId]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewLogo(e.target.files[0]);
    }
  };

  // Upload new employer logo
  const handleLogoUpload = async () => {
    if (!newLogo || !employerId) return;

    const formData = new FormData();
    formData.append("logo", newLogo);

    try {
      const res = await fetch(`/api/employer/upload-logo/${employerId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setLogo(data.logoPath);
        setShowModal(false);
      } else {
        alert("Failed to upload logo");
      }
    } catch (err) {
      console.error("Error uploading logo:", err);
    }
  };

  return (
    <div>
      {/* Employer Card */}
      <Card className="mb-2">
        <Card.Body className="text-center">
          <img
            src={logo ?? "/placeholder.png"}
            alt="Employer Logo"
            style={{ width: "100px", borderRadius: "0.5rem" }}
          />
          <div className="mt-2">
            <button
              className="btn btn-link p-0"
              style={{ color: "#0a66c2" }}
              onClick={() => setShowModal(true)}
            >
              Edit Logo
            </button>
          </div>
          <div className="mt-3 fw-bold text-capitalize">{employerName}</div>
        </Card.Body>
      </Card>

      {/* Modal for uploading logo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogoUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sidebar Accordion */}
      <Accordion defaultActiveKey="0" className="mt-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Dashboard</Accordion.Header>
          <Accordion.Body>
            <Link href="/employer/dashboard" className="d-block fw-bold">
              Dashboard
            </Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Job Posting</Accordion.Header>
          <Accordion.Body>
            <div>
              <Link href="/employer/job/manage-jobs">Manage Jobs</Link>
            </div>
            <div>
              <Link href="/employer/job/manage-jobs?status=all" className="text-primary fw-bold">
                List of Jobs ({jobCounts.all})
              </Link>
            </div>
            <div>
              <Link href="/employer/job/manage-jobs?status=active" className="text-success fw-bold">
                Active Jobs ({jobCounts.active})
              </Link>
            </div>
            <div>
              <Link href="/employer/job/manage-jobs?status=expired" className="text-danger fw-bold">
                Expired Jobs ({jobCounts.expired})
              </Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Search Resumes</Accordion.Header>
          <Accordion.Body>
            <div>
              <Link href="/employer/resume/candidate-profile">Search Resume</Link>
            </div>
            <div>
              <Link href="/employer/resume/resume-collections">Saved Resumes</Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Applicant Tracking</Accordion.Header>
          <Accordion.Body>
            <div>Applicant Tracking (75)</div>
            <div>Direct Applicants</div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>My Account</Accordion.Header>
          <Accordion.Body>
            <div>
              <Link href="/employer/profile">Employer Profile</Link>
            </div>
            <div>
              <Link href="/employer/manage/users">
                Manage Users ({userCount}) {/* Dynamic user count */}
              </Link>
            </div>
            <div>
              <Link href="/employer/manage/change-password">Change Password</Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default EmployerSidebar;
