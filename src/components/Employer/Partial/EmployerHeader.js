import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const EmployerHeader = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employerId, setEmployerId] = useState(null);
  const navigate = useNavigate();

  // Get employerId from localStorage
  const getEmployerId = () => {
    const id = localStorage.getItem('employerId');
    return id ? id : null; // Return null if employerId doesn't exist
  };

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(token !== null && token !== ''); // Set login status based on token
    setEmployerId(getEmployerId()); // Set employer ID based on localStorage
  }, []);

  const handleLogout = () => {
    console.log("Logging out..."); // For debugging
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('employerId'); // Remove employerId as well
    if (onLogout) onLogout(); // Call the onLogout prop to update authentication state
    navigate('/login'); // Redirect to login page using useNavigate
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

            {/* Only show logout if the employer is logged in */}
            {isLoggedIn && (
              <Nav.Link onClick={handleLogout} className="text-white" style={{ cursor: 'pointer' }}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default EmployerHeader;
