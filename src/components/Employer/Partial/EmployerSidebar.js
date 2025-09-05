import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmployerSidebar = () => {
  const [jobCounts, setJobCounts] = useState({
    active: 0,
    expired: 0,
    all: 0
  });
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [newLogo, setNewLogo] = useState(null); // State for new logo file
  const [logo, setLogo] = useState(localStorage.getItem('employerLogo') || null); // Initialize logo from localStorage
  const employerName = localStorage.getItem('employerName');
  const employerId = localStorage.getItem('employerId'); // Assume employer ID is stored in localStorage
  
  // Fetch the employer's logo from the server if not in localStorage
  const fetchEmployerLogo = async () => {
    if (!localStorage.getItem('employerLogo')) {
      try {
        const response = await fetch(`http://localhost:4000/api/employers/logo/${employerId}`);
        const data = await response.json();
        if (data.logo) {
          setLogo(data.logo); // Set the logo if returned from the server
          localStorage.setItem('employerLogo', data.logo); // Store the logo in localStorage
        }
      } catch (error) {
        console.error('Error fetching employer logo:', error);
      }
    }
  };
  
  // Fetch job counts (active, expired, all) from the API
  const fetchJobCounts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/jobs/counts/${employerId}`);
      const data = await response.json();
      setJobCounts(data);
    } catch (error) {
      console.error('Error fetching job counts:', error);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    if (!logo) {
      fetchEmployerLogo(); // Fetch the current logo if it's not available in state
    }
    fetchJobCounts(); // Fetch job counts
  }, []);
  
  // Handle logo file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewLogo(file); // Update the newLogo state with the selected file
  };
  
  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!newLogo) {
      alert('Please select an image to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('logo', newLogo); // Append the file to the form data
  
    try {
      const response = await fetch(`http://localhost:4000/api/employers/upload-logo/${employerId}`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        setLogo(data.logoPath); // Update the logo state with the new logo path
        localStorage.setItem('employerLogo', data.logoPath); // Save the new logo in localStorage
        setShowModal(false); // Close the modal
      } else {
        alert('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };
  
  return (
    <div>
      <Card style={{ marginBottom: '0.1rem' }}>
        <Card.Body>
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Use the dynamic logo URL from state */}
            <img
             src={logo ? `http://localhost:4000${logo}` : 'https://via.placeholder.com/100'}
             alt="Logo"
             style={{ width: '100px', borderRadius: '0.5rem' }}
          />
          </div>
          <div className="text-center mt-2">
            <a href="#" className="small" style={{ color: '#0a66c2' }} onClick={() => setShowModal(true)}>
              Edit Logo
            </a>
          </div>
          <div className="mt-3 fw-bold text-capitalize mb-3">
            Welcome, {employerName}
          </div>
        </Card.Body>
      </Card>

      {/* Modal for editing logo */}
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

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className="mt-2">
          <Accordion.Header>
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Accordion.Header>
          <Accordion.Body>
            <Link to="/employer/dashboard" className="accordion-button2 fw-bold drop-padd card-dashboard2">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <i className="bi bi-briefcase-fill me-2" style={{ color: '#808080' }}></i> Job Posting
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <Link to="/employer/manage-jobs">Manage Jobs</Link>
            </div>
            <div className="pb-1">
              <Link
                to="/employer/manage-jobs?status=all"
                style={{ color: '#0a66c2', fontWeight: 'bold' }} // Blue for all jobs
              >
                List of Jobs ({jobCounts.all})
              </Link>
            </div>

            <div className="pb-1">
              <Link
                to="/employer/manage-jobs?status=active"
                style={{ color: '#28a745', fontWeight: 'bold' }} // Green for active jobs
              >
                Active Jobs ({jobCounts.active})
              </Link>
            </div>

            <div className="pb-1">
              <Link
                to="/employer/manage-jobs?status=expired"
                style={{ color: '#dc3545', fontWeight: 'bold' }} // Red for expired jobs
              >
                Expired Jobs ({jobCounts.expired})
              </Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <i className="bi bi-search me-2" style={{ color: '#808080' }}></i> Search Resumes
          </Accordion.Header>
          <Accordion.Body>

            <div className="pb-1">
            <Link
                to="/employer/resumes"
              >
                Search Resume
             </Link>
            </div>
            <div className="pb-1">
              <a href="#">Search Applicant</a>
            </div>
            <Link
                to="/employer/resume-collections"
              >
                Saved Resumes
             </Link>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <i className="bi bi-person-bounding-box me-2" style={{ color: '#808080' }}></i> Applicant Tracking
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

        <Accordion.Item eventKey="4">
          <Accordion.Header>
            <i className="bi bi-shield-lock-fill me-2" style={{ color: '#808080' }}></i> My Account
          </Accordion.Header>
          <Accordion.Body>
            <div className="pb-1">
              <Link to="/employer/profile">Employer Profile</Link>
            </div>
            <div className="pb-1">
              <Link to="/employer/manage/users">Manage Users (5)</Link>
            </div>
            <div className="pb-1">
              <Link to="/employer/change/password">Change Password</Link>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default EmployerSidebar;
