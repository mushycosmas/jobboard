// Import React and Bootstrap components
'use client'
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

// Example static data: a list of employers with their logos
const employers = [
  { name: "Google", logo: "https://logo.example.com/google.png" },
  { name: "Apple", logo: "https://logo.example.com/apple.png" },
  { name: "Microsoft", logo: "https://logo.example.com/microsoft.png" },
  { name: "Amazon", logo: "https://logo.example.com/amazon.png" },
  { name: "Facebook", logo: "https://logo.example.com/facebook.png" },
  { name: "Tesla", logo: "https://logo.example.com/tesla.png" },
];

const AllEmployer = () => {
  return (
    <Container className="py-5 bg-light">
      <h1 className="text-center mb-4">All Employers</h1>
      <Row>
        {employers.map((employer, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <img
                  src={employer.logo}
                  alt={`${employer.name} logo`}
                  className="mb-3 rounded-circle"
                  style={{ width: "80px", height: "80px", objectFit: "contain" }}
                />
                <Card.Title>{employer.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllEmployer;
