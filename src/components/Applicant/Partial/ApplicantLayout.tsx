"use client"; // ✅ mark this layout as a client component

import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import ApplicantSidebar from "@/components/Applicant/Partial/ApplicantSidebar";
import ApplicantHeader from "@/components/Applicant/Partial/ApplicantHeader";

const ApplicantLayout = ({ children }) => {
  return (
    <>
      <ApplicantHeader />

      <Container style={{ marginTop: "4rem", marginBottom: "2rem" }}>
        <Row>
          <Col md={3}>
            <ApplicantSidebar />
          </Col>
          <Col md={9}>
            <main>{children}</main>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ApplicantLayout;
