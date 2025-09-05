import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

const ApplicantHeader = ({ onLogout }) => {
  const handleLogout = () => {
   console.log("Logging out..."); // For debugging
    localStorage.removeItem('token'); // Remove the token
    if (onLogout) onLogout(); // Call the onLogout prop to update authentication state
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <Navbar expand="lg" fixed="top" style={{ backgroundColor: '#000' }}>
      <Container>
        <Navbar.Brand href="/">
          <img
            src="https://ejobsitesoftware.com/jobboard_demo/img/logo.png"
            width="149"
            height="25"
            alt="Jobboard Logo"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" className="text-white">
          <BsList />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="text-white">Home</Nav.Link>
            <Nav.Link href="/all-jobs" className="text-white">Jobs</Nav.Link>
            <Nav.Link onClick={handleLogout} className="text-white" style={{ cursor: 'pointer' }}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ApplicantHeader;
