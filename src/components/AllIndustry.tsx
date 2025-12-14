'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const AllIndustry = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12; // Items per page

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/industries?limit=${limit}&page=${page}`);
      if (!res.ok) throw new Error(`Failed to fetch industries: ${res.status}`);
      const data = await res.json();

      if (data.length < limit) setHasMore(false); // No more data to load
      setIndustries((prev) => [...prev, ...data]);
    } catch (err) {
      setError('Error fetching industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, [page]);

  if (error) return <p className="text-center text-danger my-5">{error}</p>;

  return (
    <div className="container my-5 py-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white text-center py-5 rounded-top">
          <h2 className="mb-3">Browse Jobs by Industry</h2>
          <p className="mb-0">Discover the top industries and available job opportunities</p>
        </Card.Header>
        <Card.Body className="py-5">
          <Row className="g-4">
            {industries.map((industry) => (
              <Col md={4} sm={6} key={industry.id}>
                <Card className="shadow-sm border-0 h-100 hover-card transition">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <h5 className="card-title fw-bold">{industry.category}</h5>
                    <p className="text-muted">{industry.job_count} Jobs Available</p>
                    <Link
                      href={`/job/category/${industry.slug}`}
                      className="btn btn-outline-primary mt-3 align-self-start"
                    >
                      View Jobs
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {hasMore && (
            <div className="text-center mt-4">
              <Button onClick={() => setPage(page + 1)} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default AllIndustry;
