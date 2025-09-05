'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import jobboardLogo from '../../assets/logo/jobboard.png';

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ FIX: get user from session.user
  const user = session?.user;
  const userType = user?.role;

  const getDashboardLink = () => {
    switch (userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'applicant':
        return '/applicant/dashboard';
      default:
        return '/';
    }
  };

  const renderUserName = () => {
    if (!user) return 'My Account';
    return user.username || 'My Account';
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <>
      <style>{`
        .navbar {
          min-height: 50px !important;
          padding-top: 0.25rem !important;
          padding-bottom: 0.25rem !important;
        }
        .nav-link-custom {
          border-radius: 30px;
          padding: 5px 15px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white !important;
          line-height: 1.2;
          font-size: 0.9rem;
        }
        .nav-link-custom:hover {
          background-color: black;
          color: #f0ad4e !important;
          transform: scale(1.05);
        }
        .navbar-brand img {
          height: 40px !important;
          width: auto !important;
        }
        .dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 5px 10px !important;
          font-size: 0.9rem;
          color: white !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .dropdown-toggle img {
          height: 30px;
          width: 30px;
          object-fit: cover;
          border-radius: 50%;
        }
      `}</style>

      <Navbar expand="lg" fixed="top" style={{ background: '#276795' }}>
        <Container>
          <Navbar.Brand href="/">
            <img src={jobboardLogo.src || jobboardLogo} alt="Jobboard Logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarSupportedContent" className="text-white">
            <BsList />
          </Navbar.Toggle>

          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="ms-auto me-auto">
              <Nav.Link href="/" className="nav-link-custom">Home</Nav.Link>
              <Nav.Link href="/all-jobs" className="nav-link-custom">Jobs</Nav.Link>
              {userType === 'employer' && (
                <Nav.Link href="/employer/manage-jobs" className="nav-link-custom">
                  Manage Jobs
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto">
              {status === 'loading' ? null : !user ? (
                <>
                  <Nav.Link href="/auth/login" className="nav-link-custom">Login</Nav.Link>
                  <Nav.Link href="/auth/register" className="nav-link-custom">Register</Nav.Link>
                </>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle className="nav-link-custom">
                    <img
                      src={'https://via.placeholder.com/100'}
                      alt="Profile"
                    />
                    {renderUserName()}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href={getDashboardLink()}>Dashboard</Dropdown.Item>
                    <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
