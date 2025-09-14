"use client";

import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BsList } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const EmployerHeader: React.FC = () => {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const isLoggedIn = status === "authenticated";
  const employerId = session?.user?.employerId ?? null;

  return (
    <Navbar expand="lg" fixed="top" style={{ backgroundColor: "#000" }}>
      <Container>
        <Navbar.Brand href="/">
          <img
            src="https://ejobsitesoftware.com/jobboard_demo/img/logo.png"
            width="149"
            height="25"
            alt="Jobboard Logo"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" className="text-white">
          <BsList />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto align-items-center">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link className="text-white">Home</Nav.Link>
            </Link>

            {isLoggedIn && employerId && (
              <Nav.Link
                onClick={handleLogout}
                className="text-white"
                style={{ cursor: "pointer" }}
              >
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
