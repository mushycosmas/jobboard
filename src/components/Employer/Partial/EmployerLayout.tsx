"use client";

import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EmployerHeader from "../Header/EmployerHeader"; // Adjust path if needed
import EmployerSidebar from "./EmployerSidebar";

interface EmployerLayoutProps {
  children: ReactNode;
}

const EmployerLayout: React.FC<EmployerLayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <EmployerHeader />

      {/* Main Content with Sidebar */}
      <Container style={{ marginTop: "5rem", marginBottom: "2rem" }}>
        <Row>
          {/* Sidebar */}
          <Col md={3}>
            <EmployerSidebar />
          </Col>

          {/* Main content */}
          <Col md={9}>
            <main className="main-content">{children}</main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmployerLayout;
