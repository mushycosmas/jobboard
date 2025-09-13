'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Accordion, Card, Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ApplicantSidebar: React.FC = () => {
  const { data: session } = useSession();
  const applicantId = session?.user?.applicantId?.toString() || null;
  const applicantFirstname = session?.user?.applicantFirstname ?? '';
  const applicantLastname = session?.user?.applicantLastname ?? '';

  const [logo, setLogo] = useState<string>('https://via.placeholder.com/100');
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Accordion toggle
  const handleAccordionSelect = (key: string | null) => {
    if (!key) return;
    setActiveKey(prev => (prev === key ? null : key));
  };

  // Load current logo
  const fetchLogo = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/logo/${applicantId}`);
      const data = await res.json();
      if (data.logo) setLogo(data.logo);
      else setLogo('https://via.placeholder.com/100');
    } catch (err) {
      console.error('Error fetching logo:', err);
      setLogo('https://via.placeholder.com/100');
    }
  };

  useEffect(() => {
    fetchLogo();
  }, [applicantId]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewLogo(file);
  };

  // Upload new logo
  const uploadLogo = async () => {
    if (!newLogo || !applicantId) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('logo', newLogo);

    try {
      const res = await fetch(`/api/applicant/upload-logo/${applicantId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setLogo(data.logoPath);
        setShowModal(false);
        setNewLogo(null);
      } else {
        alert('Failed to upload logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
    }
  };

  // Auto-expand accordion based on pathname
  useEffect(() => {
    if (pathname === '/applicant/dashboard') setActiveKey('0');
    else if (pathname?.includes('/applicant/profile/')) setActiveKey('1');
    else if (pathname?.includes('/applicant/cv-template/')) setActiveKey('2');
    else if (pathname?.includes('/applicant/job/')) setActiveKey('3');
    else setActiveKey(null);
  }, [pathname]);

  return (
    <div>
      {/* Logo Card */}
      <Card style={{ marginBottom: '0.1rem' }}>
        <Card.Body className="text-center d-flex flex-column align-items-center">
          <img
            src={logo}
            alt="Logo"
            style={{ width: '100px', borderRadius: '0.5rem' }}
          />
          <div className="mt-2">
            <a
              href="#"
              className="small"
              style={{ color: '#0a66c2' }}
              onClick={() => setShowModal(true)}
            >
              Edit Logo
            </a>
          </div>
          <div className="mt-3 fw-bold text-capitalize mb-3">
            Welcome, {applicantLastname} {applicantFirstname}
          </div>
        </Card.Body>
      </Card>

      {/* Upload Modal */}
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
          <Button variant="primary" onClick={uploadLogo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sidebar Accordion */}
      <Accordion activeKey={activeKey} onSelect={handleAccordionSelect}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Dashboard</Accordion.Header>
          <Accordion.Body>
            <Link href="/applicant/dashboard">Dashboard</Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>My Profile</Accordion.Header>
          <Accordion.Body>
            <Link href="/applicant/profile/personal-details">Personal Details</Link>
            <br />
            <Link href="/applicant/profile/academic-qualification">Academic Qualifications</Link>
            <br />
            <Link href="/applicant/profile/professional-qualification">Professional Qualifications</Link>
            <br />
            <Link href="/applicant/profile/language-proficiency">Language Proficiency</Link>
            <br />
            <Link href="/applicant/profile/workExperience">Work Experience</Link>
            <br />
            <Link href="/applicant/profile/skills">Skills</Link>
            <br />
            <Link href="/applicant/profile/applicant-referees">Referees</Link>
            <br />
            <Link href="/applicant/profile/social-media">Social Media</Link>
            <br />
            <Link href="/applicant/profile/change-password">Change Password</Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Build My CV</Accordion.Header>
          <Accordion.Body>
            <Link href="/applicant/cv-template/cv">Select CV Template</Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>My Applications</Accordion.Header>
          <Accordion.Body>
            <Link href="/applicant/job/applications">Applied Jobs</Link>
            <br />
            <Link href="/applicant/job/saved-jobs">Saved Jobs</Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ApplicantSidebar;
