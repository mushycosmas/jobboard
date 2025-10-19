"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BsList } from "react-icons/bs";

const CustomNavbar = ({ onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out..."); // For debugging
    localStorage.removeItem("token"); // Remove auth token
    if (onLogout) onLogout(); // Trigger parent update if provided
    router.push("/"); // Redirect to home or login
  };

  return (
    <Navbar expand="lg" fixed="top" style={{ backgroundColor: "#000" }}>
      <Container>
        <Navbar.Brand as={Link} href="/">
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
            <Nav.Link as={Link} href="/" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link
              onClick={handleLogout}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
