'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Accordion, Card, Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ApplicantSidebar: React.FC = () => {
  const [jobCounts] = useState({ applied: 5, saved: 3 });
  const [showModal, setShowModal] = useState(false);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [logo, setLogo] = useState<string>('https://via.placeholder.com/100');

  const applicantId = typeof window !== 'undefined' ? localStorage.getItem('applicantId') : null;
  const applicantFirstname = typeof window !== 'undefined' ? localStorage.getItem('applicantFirstname') : '';
  const applicantLastname = typeof window !== 'undefined' ? localStorage.getItem('applicantLastname') : '';

  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState<string | null>(null); // only one section open at a time

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewLogo(file);
  };

  const fetchApplicantLogo = async () => {
    if (!applicantId) return;
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/logo/${applicantId}`);
      const data = await response.json();
      if (data.logo) {
        setLogo(data.logo);
        localStorage.setItem('logo', data.logo);
      } else setLogo('https://via.placeholder.com/100');
    } catch (error) {
      console.error('Error fetching applicant logo:', error);
      setLogo('https://via.placeholder.com/100');
    }
  };

  useEffect(() => {
    const storedLogo = localStorage.getItem('logo');
    if (storedLogo) setLogo(storedLogo);
    else fetchApplicantLogo();
  }, [pathname, applicantId]);

  const handleLogoUpload = async () => {
    if (!newLogo) return alert('Please select an image to upload');
    const formData = new FormData();
    formData.append('logo', newLogo);
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/upload-logo/${applicantId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setLogo(data.logoPath);
        localStorage.setItem('logo', data.logoPath);
        setShowModal(false);
      } else alert('Failed to upload logo');
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  // Determine which accordion section should be open based on pathname
  useEffect(() => {
    if (pathname?.includes('/applicant/profile/')) {
      setActiveKey('1'); // My Profile section
    } else if (pathname?.includes('/applicant/cv-template/')) {
      setActiveKey('2'); // Build My CV
    } else if (pathname?.includes('/applicant/job/')) {
      setActiveKey('3'); // My Applications
    } else {
      setActiveKey(null);
    }
  }, [pathname]);

  const toggleAccordion = (key: string) => {
    setActiveKey((prev) => (prev === key ? null : key));
  };

  const isActive = (key: string) => activeKey === key;

  return (
    <div>
      {/* Logo Card */}
      <Card style={{ marginBottom: '0.1rem' }}>
        <Card.Body className="text-center d-flex flex-column align-items-center">
          <img
            src={logo ? `http://localhost:4000${logo}` : 'https://via.placeholder.com/100'}
            alt="Logo"
            style={{ width: '100px', borderRadius: '0.5rem' }}
          />
          <div className="mt-2">
            <a href="#" className="small" style={{ color: '#0a66c2' }} onClick={() => setShowModal(true)}>
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
          <Button variant="primary" onClick={handleLogoUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sidebar Accordion */}
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header
            className={isActive('0') ? 'bg-primary text-white' : ''}
            onClick={() => toggleAccordion('0')}
          >
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Accordion.Header>
          <Accordion.Body>
            <Link href="/applicant/dashboard">Dashboard</Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header
            className={isActive('1') ? 'bg-primary text-white' : ''}
            onClick={() => toggleAccordion('1')}
          >
            <i className="bi bi-person-bounding-box me-2" style={{ color: '#808080' }}></i> My Profile
          </Accordion.Header>
          <Accordion.Body>
            <div><Link href="/applicant/profile/personal-details">Personal Details</Link></div>
            <div><Link href="/applicant/profile/academic-qualification">Academic Qualifications</Link></div>
            <div><Link href="/applicant/profile/professional-qualification">Professional Qualifications</Link></div>
            <div><Link href="/applicant/profile/language-proficiency">Language Proficiency</Link></div>
            <div><Link href="/applicant/profile/workExperience">Work Experience</Link></div>
            <div><Link href="/applicant/profile/skills">Skills</Link></div>
            <div><Link href="/applicant/profile/applicant-referees">Referees</Link></div>
            <div><Link href="/applicant/profile/social-media">Social Media</Link></div>
            <div><Link href="/applicant/profile/change-password">Change Password</Link></div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header
            className={isActive('2') ? 'bg-primary text-white' : ''}
            onClick={() => toggleAccordion('2')}
          >
            <i className="bi bi-file-earmark-text me-2" style={{ color: '#808080' }}></i> Build My CV
          </Accordion.Header>
          <Accordion.Body>
            <Link href="/applicant/cv-template/cv">Select CV Template</Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header
            className={isActive('3') ? 'bg-primary text-white' : ''}
            onClick={() => toggleAccordion('3')}
          >
            <i className="bi bi-briefcase-fill me-2" style={{ color: '#808080' }}></i> My Applications
          </Accordion.Header>
          <Accordion.Body>
            <div><Link href="/applicant/job/applications">Applied Jobs</Link></div>
            <div><Link href="/applicant/job/saved-jobs">Saved Jobs</Link></div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ApplicantSidebar;
