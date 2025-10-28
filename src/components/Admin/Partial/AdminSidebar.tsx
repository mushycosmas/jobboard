"use client";

import Link from "next/link";
import { Accordion, Card } from "react-bootstrap";

const AdminSidebar = () => {
  return (
    <div>
      {/* Logo & Welcome Section */}
      <Card style={{ marginBottom: "0.05rem" }}>
        <Card.Body>
          <div
            className="text-center"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <img
              src="https://ejobsitesoftware.com/jobboard_demo/image.php?image_name=logo/20240830075831logo-w__1_.jpg&size=300"
              alt="Logo"
              style={{ width: "100px", borderRadius: "0.5rem" }}
            />
          </div>
          <div className="text-center mt-2">
            <a href="#" className="small" style={{ color: "#0a66c2" }}>
              Edit Logo
            </a>
          </div>
          <div className="mt-3 fw-bold text-capitalize mb-3">
            Welcome, Metagrowth Digital
          </div>
        </Card.Body>
      </Card>

      {/* Sidebar Menu */}
      <Accordion defaultActiveKey="0">
        {/* Dashboard */}
        <Accordion.Item eventKey="0" className="mt-2">
          <Accordion.Header>
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Accordion.Header>
          <Accordion.Body>
            <Link
              href="/admin/dashboard"
              className="accordion-button2 fw-bold drop-padd card-dashboard2"
            >
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </Accordion.Body>
        </Accordion.Item>

        {/* Job Posting */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <i className="bi bi-briefcase-fill me-2" style={{ color: "#808080" }}></i> Job Posting
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <Link href="/admin/manage-jobs">Post a job</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/job/lists">List of jobs (123)</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/post-job">Active jobs (3)</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/post-job">Expired jobs (23)</Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Search Resumes */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <i className="bi bi-search me-2" style={{ color: "#808080" }}></i> Search Resumes
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <a href="/admin/resume">Search resume</a>
            </div>
            <div className="pb-1">
              <a href="#">Search applicant</a>
            </div>
            <div className="pb-1">
              <a href="#">Resume search agents</a> (3)
            </div>
            <div className="pb-1">
              <a href="#">Saved resumes</a> (28)
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Applicant Tracking */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <i className="bi bi-person-bounding-box me-2" style={{ color: "#808080" }}></i> Applicant Tracking
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <a href="#">Applicant Tracking</a> (75)
            </div>
            <div className="pb-1">
              <a href="#">Direct Applicants</a>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* CVs */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            <i className="bi bi-person-bounding-box me-2" style={{ color: "#808080" }}></i> CVs
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <Link href="/admin/cv/template">CV Templates</Link> (75)
            </div>
            <div className="pb-1">
              <a href="#">Blank</a>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Resources */}
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            <i className="bi bi-gear-fill me-2" style={{ color: "#808080" }}></i> Resources
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <Link href="/admin/resources/country">Manage Country</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/state">Manage State</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/category">Manage Category</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/position-levels">Position Level</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/job-types">Job Types</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/experiences">Experiences</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/cultures">Cultures</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/resources/skills">Skills</Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* My Account */}
        <Accordion.Item eventKey="6">
          <Accordion.Header>
            <i className="bi bi-shield-lock-fill me-2" style={{ color: "#808080" }}></i> My Account
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <Link href="/admin/user/profile">Edit Profile</Link>
            </div>
            <div className="pb-1">
              <Link href="#">Order history</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/manage-users">Manage User (5)</Link>
            </div>
            <div className="pb-1">
              <Link href="/admin/change-password">Change password</Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default AdminSidebar;
