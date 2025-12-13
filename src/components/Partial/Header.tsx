'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import jobboardLogo from '../../assets/logo/jobboard.png';

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

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

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <style>{`
        .portal-navbar {
          background: #276795;
          min-height: 64px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .portal-brand img {
          height: 42px;
        }

        .portal-link {
          color: #fff !important;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 30px;
          transition: all 0.25s ease;
          font-size: 0.9rem;
        }

        .portal-link:hover {
          background: rgba(255,255,255,0.15);
        }

        .portal-link.active {
          background: #000;
          color: #f0ad4e !important;
        }

        .portal-toggle {
          border: none;
          color: #fff;
          font-size: 1.5rem;
        }

        .user-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent !important;
          border: none !important;
          color: #fff !important;
          font-weight: 600;
        }

        .user-toggle img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #fff;
        }

        .dropdown-menu {
          border-radius: 12px;
          padding: 8px;
        }

        .dropdown-item {
          border-radius: 8px;
          font-weight: 500;
        }

        .auth-btn {
          border-radius: 30px;
          padding: 6px 18px;
          font-weight: 600;
        }
      `}</style>

      <Navbar expand="lg" fixed="top" className="portal-navbar">
        <Container>
          <Navbar.Brand as={Link} href="/" className="portal-brand">
            <img src={jobboardLogo.src || jobboardLogo} alt="Jobboard Logo" />
          </Navbar.Brand>

          <Navbar.Toggle className="portal-toggle">
            <BsList />
          </Navbar.Toggle>

          <Navbar.Collapse>
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                href="/"
                className={`portal-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                href="/job/all"
                className={`portal-link ${isActive('/job/all') ? 'active' : ''}`}
              >
                Jobs
              </Nav.Link>

              {userType === 'employer' && (
                <Nav.Link
                  as={Link}
                  href="/employer/manage-jobs"
                  className={`portal-link ${isActive('/employer/manage-jobs') ? 'active' : ''}`}
                >
                  Manage Jobs
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto">
              {status === 'loading' ? null : !user ? (
                <>
                  <Button
                    as={Link}
                    href="/auth/login"
                    variant="outline-light"
                    className="auth-btn me-2"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    href="/auth/register"
                    variant="warning"
                    className="auth-btn"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle className="user-toggle">
                    <img
                      src={user.image || 'https://via.placeholder.com/100'}
                      alt="Profile"
                    />
                    {user.username || 'My Account'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} href="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} href={getDashboardLink()}>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} href="/settings">
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      Logout
                    </Dropdown.Item>
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
