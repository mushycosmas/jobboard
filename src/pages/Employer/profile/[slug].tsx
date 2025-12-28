'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Row, Col, Button, Spinner, ListGroup, Alert, Badge } from 'react-bootstrap';
import Layout from '../../../components/Layout';
import { FaFacebook, FaTwitter, FaLinkedin, FaGlobe } from 'react-icons/fa';

interface Employer {
  id: number;
  company_name: string;
  industry_name: string;
  region_name: string;
  company_size: string;
  aboutCompany: string;
  logo?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

interface Job {
  id: number;
  title: string;
  slug: string;
  posting_date: string;
}

const EmployerProfilePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [employer, setEmployer] = useState<Employer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchEmployerData = async () => {
      setLoading(true);
      try {
        const employerRes = await fetch(`/api/employer/profile/${encodeURIComponent(slug as string)}`);
        if (!employerRes.ok) throw new Error('Employer not found');
        const employerData: Employer = await employerRes.json();

        setEmployer({
  ...employerData,
  logo: employerData.logo
    ? employerData.logo.startsWith('http')
      ? employerData.logo
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${employerData.logo.replace(/^\/+/, '')}`
    : '/default-logo.png',
});


        const jobsRes = await fetch(`/api/jobs?employerId=${employerData.id}`);
        const jobsData: Job[] = jobsRes.ok ? await jobsRes.json() : [];
        setJobs(jobsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch employer data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, [slug]);

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5 text-center"><Alert variant="danger">{error}</Alert></Container>;

  const normalizeUrl = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <Layout>
      <Container style={{ marginTop: '80px', marginBottom: '2rem' }}>
        <Row className="gy-4">
          {/* Left Column */}
          <Col md={4}>
  <Card className="shadow-sm text-center p-4 border-0">
    {employer?.logo && (
      <div
        style={{
          width: '150px',
          height: '150px',
          margin: '0 auto',
          border: '3px solid #276795',
          borderRadius: '12px', // slightly rounded instead of circle
          overflow: 'hidden',
          padding: '5px',
          backgroundColor: '#fff',
        }}
      >
        <img
          src={employer.logo}
          alt={employer.company_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // maintain aspect ratio
          }}
        />
      </div>
    )}

    <h4 className="fw-bold mt-3">{employer?.company_name}</h4>
    <p className="text-muted mb-1">{employer?.industry_name}</p>
    <p className="text-muted">{employer?.address || 'Location not set'}</p>

    <div className="d-flex justify-content-center gap-2 mt-3">
      <Button variant="primary" className="px-4">Follow</Button>
      <Button variant="outline-primary" className="px-4">Contact</Button>
    </div>

    <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
      {employer?.website && (
        <a href={normalizeUrl(employer.website)} target="_blank" rel="noopener noreferrer" className="text-dark fs-5" title="Website">
          <FaGlobe />
        </a>
      )}
      {employer?.linkedin && (
        <a href={normalizeUrl(employer.linkedin)} target="_blank" rel="noopener noreferrer" className="text-primary fs-5" title="LinkedIn">
          <FaLinkedin />
        </a>
      )}
      {employer?.twitter && (
        <a href={normalizeUrl(employer.twitter)} target="_blank" rel="noopener noreferrer" className="text-info fs-5" title="Twitter">
          <FaTwitter />
        </a>
      )}
      {employer?.facebook && (
        <a href={normalizeUrl(employer.facebook)} target="_blank" rel="noopener noreferrer" className="text-primary fs-5" title="Facebook">
          <FaFacebook />
        </a>
      )}
    </div>
  </Card>
</Col>


          {/* Right Column */}
          <Col md={8}>
            <Card className="shadow-sm border-0 mb-4 p-3">
              <Card.Body>
                <Row className="mb-2"><Col sm={4}><strong>Company Name:</strong></Col><Col sm={8}>{employer?.company_name}</Col></Row>
                <Row className="mb-2"><Col sm={4}><strong>Industry:</strong></Col><Col sm={8}>{employer?.industry_name}</Col></Row>
                <Row className="mb-2"><Col sm={4}><strong>Location:</strong></Col><Col sm={8}>{employer?.region_name}</Col></Row>
                <Row className="mb-2"><Col sm={4}><strong>Company Size:</strong></Col><Col sm={8}>{employer?.company_size}</Col></Row>
                <Row><Col sm={4}><strong>About:</strong></Col><Col sm={8}>{employer?.aboutCompany}</Col></Row>
              </Card.Body>
            </Card>

            {/* Jobs List */}
            <Card className="shadow-sm border-0 p-3">
              <Card.Body>
                <h5 className="mb-3">Jobs Posted</h5>
                {jobs.length ? (
                  <ListGroup variant="flush">
                    {jobs.map((job) => (
                      <ListGroup.Item
                        key={job.id}
                        action
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/job/${job.slug}`)}
                      >
                        <span>{job.title}</span>
                        <Badge bg="primary">{new Date(job.posting_date).toLocaleDateString()}</Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No jobs posted yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default EmployerProfilePage;
