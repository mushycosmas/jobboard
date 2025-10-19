v// app/Layouts/ApplicantLayout.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// ✅ Your custom partials
import ApplicantSidebar from "../components/Applicant/Partial/ApplicantSidebar";
import ApplicantHeader from "../components/Applicant/Partial/ApplicantHeader";

// ✅ The real Provider — make sure you have the fixed context!
import UniversalDataProvider from "../context/UniversalDataContext";

const ApplicantLayout = ({ children }) => {
  return (
    <UniversalDataProvider>
      {/* ✅ Your top header */}
      <ApplicantHeader />

      {/* ✅ Main content with sidebar */}
      <Container style={{ marginTop: "4rem", marginBottom: "2rem" }}>
        <Row>
          {/* Sidebar column */}
          <Col md={3}>
            <ApplicantSidebar />
          </Col>

          {/* Main content column */}
          <Col md={9}>
            <main className="main-content">{children}</main>
          </Col>
        </Row>
      </Container>
    </UniversalDataProvider>
  );
};

export default ApplicantLayout;
