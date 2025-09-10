"use client";

import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

interface CVTemplate4Props {
  data: any; // Replace with your typed interface if needed
}

const CVTemplate4: React.FC<CVTemplate4Props> = ({ data }) => {
  const { profile, educationalQualifications, professionalQualifications, experiences, languages, skills, referees, socialMediaLinks } = data;

  return (
    <div className="cv-template-4 border p-4" style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "28px" }}>{profile.fullName}</h1>
        <p className="text-muted mb-1">{profile.email} | {profile.phone}</p>
        <p className="text-muted mb-1">{profile.address}</p>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h5>Professional Summary</h5>
        <p>{profile.summary}</p>
      </div>

      {/* Two Column Layout */}
      <div className="d-flex flex-column flex-md-row gap-4">
        {/* Left Column */}
        <div className="flex-md-6 flex-grow-1">
          {/* Education */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-primary text-white">Education</Card.Header>
            <ListGroup variant="flush">
              {educationalQualifications.map((edu: any, idx: number) => (
                <ListGroup.Item key={idx}>
                  <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Professional Qualifications */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-secondary text-white">Professional Qualifications</Card.Header>
            <ListGroup variant="flush">
              {professionalQualifications.map((pq: any, idx: number) => (
                <ListGroup.Item key={idx}>{pq.title} ({pq.year})</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Languages */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-info text-white">Languages</Card.Header>
            <ListGroup variant="flush">
              {languages.map((lang: string, idx: number) => (
                <ListGroup.Item key={idx}>{lang}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex-md-6 flex-grow-1">
          {/* Experiences */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-success text-white">Work Experience</Card.Header>
            <ListGroup variant="flush">
              {experiences.map((exp: any, idx: number) => (
                <ListGroup.Item key={idx}>
                  <strong>{exp.role}</strong> - {exp.company} ({exp.duration})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Skills */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-warning text-white">Skills</Card.Header>
            <Card.Body>
              {skills.map((skill: string, idx: number) => (
                <Badge key={idx} bg="dark" className="me-1 mb-1">{skill}</Badge>
              ))}
            </Card.Body>
          </Card>

          {/* Referees */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-danger text-white">Referees</Card.Header>
            <ListGroup variant="flush">
              {referees.map((ref: any, idx: number) => (
                <ListGroup.Item key={idx}>
                  {ref.name} - {ref.position} ({ref.contact})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Social Media */}
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-dark text-white">Social Media</Card.Header>
            <Card.Body>
              {socialMediaLinks.map((s: any, idx: number) => (
                <p key={idx}><a href={s.url} target="_blank" rel="noreferrer">{s.platform}</a></p>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CVTemplate4;
