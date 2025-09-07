'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link'; // Use Next.js's Link component

const AllIndustry = () => {
  const [industries, setIndustries] = useState([]); // State to store fetched industries
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors if any
  const [limit] = useState(12); // Default limit for industries (can be adjusted)

  // Fetch industries when the component mounts or limit changes
  useEffect(() => {
    const getIndustries = async () => {
      setLoading(true);
      try {
        const url = `/api/industries?limit=${limit}`; // API URL with a limit

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Failed to fetch industries: ${res.status}`);
        }

        const data = await res.json();
        setIndustries(data); // Update the state with fetched industries
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Error fetching industries'); // Set error if request fails
        setLoading(false);
      }
    };

    getIndustries(); // Call the function to fetch data
  }, [limit]); // Depend on limit to re-fetch industries if it changes

  // Handle loading state
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading industries...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mt-sm-3">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white p-4">
          <h2 className="m-0 text-center">Browse Jobs by Industry</h2>
          <p className="text-center mt-2">Discover the top industries and available job opportunities</p>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            {industries.map((industry) => (
              <Col md={4} sm={6} key={industry.id}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <h5 className="card-title">{industry.category}</h5>
                    <p className="card-text text-muted">{industry.job_count} Jobs Available</p>
                    <Link
                      href={`/job/category/${industry.slug}`}
                      className="btn btn-outline-primary mt-3"
                    >
                      View Jobs
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllIndustry;
