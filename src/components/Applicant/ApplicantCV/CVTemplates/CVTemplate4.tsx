"use client";

import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

interface CVTemplate4Props {
  data: any; // You can replace with a typed interface
}

const CVTemplate4: React.FC<CVTemplate4Props> = ({ data }) => {
  const {
    profile = {},
    educationalQualifications = [],
    professionalQualifications = [],
    experiences = [],
    languages = [],
    skills = [],
    referees = [],
    socialMediaLinks = [],
  } = data || {};

  return (
    <div
      className="cv-template-4 border p-4"
      style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "28px" }}>{profile.fullName ?? "No Name"}</h1>
        <p className="text-muted mb-1">{profile.email ?? "N/A"} | {profile.phone ?? "N/A"}</p>
        <p className="text-muted mb-1">{profile.address ?? "N/A"}</p>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h5>Professional Summary</h5>
        <p>{profile.summary ?? "No summary provided"}</p>
      </div>

      {/* Two Column Layout */}
      <div className="d-flex flex-column flex-md-row gap-4">
        {/* Left Column */}
        <div className="flex-md-6 flex-grow-1">
          {/* Education */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-primary text-white">Education</Card.Header>
            <ListGroup variant="flush">
              {educationalQualifications.length ? (
                educationalQualifications.map((edu: any, idx: number) => (
                  <ListGroup.Item key={idx}>
                    <strong>{edu.degree ?? "N/A"}</strong> - {edu.institution ?? "N/A"} ({edu.started ?? "N/A"} - {edu.ended ?? "N/A"})
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No education data</ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Professional Qualifications */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-secondary text-white">Professional Qualifications</Card.Header>
            <ListGroup variant="flush">
              {professionalQualifications.length ? (
                professionalQualifications.map((pq: any, idx: number) => (
                  <ListGroup.Item key={idx}>
                    {pq.course ?? pq.title ?? "N/A"} at {pq.institution ?? "N/A"} ({pq.started ?? "N/A"} - {pq.ended ?? "N/A"})
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No professional qualifications</ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Languages */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-info text-white">Languages</Card.Header>
            <ListGroup variant="flush">
              {languages.length ? (
                languages.map((lang: string, idx: number) => <ListGroup.Item key={idx}>{lang}</ListGroup.Item>)
              ) : (
                <ListGroup.Item>No languages listed</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex-md-6 flex-grow-1">
          {/* Experiences */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-success text-white">Work Experience</Card.Header>
            <ListGroup variant="flush">
              {experiences.length ? (
                experiences.map((exp: any, idx: number) => (
                  <ListGroup.Item key={idx}>
                    <strong>{exp.position ?? exp.role ?? "N/A"}</strong> - {exp.institution ?? exp.company ?? "N/A"} ({exp.from ?? "N/A"} - {exp.to ?? (exp.is_currently_working ? "Present" : "N/A")})
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No experience data</ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Skills */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-warning text-white">Skills</Card.Header>
            <Card.Body>
              {skills.length ? skills.map((skill: string, idx: number) => (
                <Badge key={idx} bg="dark" className="me-1 mb-1">{skill}</Badge>
              )) : <p>No skills listed</p>}
            </Card.Body>
          </Card>

          {/* Referees */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-danger text-white">Referees</Card.Header>
            <ListGroup variant="flush">
              {referees.length ? referees.map((ref: any, idx: number) => (
                <ListGroup.Item key={idx}>{ref.name ?? "N/A"} - {ref.position ?? "N/A"} ({ref.contact ?? "N/A"})</ListGroup.Item>
              )) : <ListGroup.Item>No referees listed</ListGroup.Item>}
            </ListGroup>
          </Card>

          {/* Social Media */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-dark text-white">Social Media</Card.Header>
            <Card.Body>
              {socialMediaLinks.length ? socialMediaLinks.map((s: any, idx: number) => (
                <p key={idx}><a href={s.url ?? "#"} target="_blank" rel="noreferrer">{s.platform ?? "N/A"}</a></p>
              )) : <p>No social media links</p>}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CVTemplate4;
