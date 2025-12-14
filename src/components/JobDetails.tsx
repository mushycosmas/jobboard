'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Container } from 'react-bootstrap';
import {
  FaBriefcase,
  FaCalendarCheck,
  FaList,
  FaCog,
  FaSave,
  FaUsers,
  FaPrint,
  FaEye,
} from 'react-icons/fa';
import { useSession } from 'next-auth/react'; // assuming you are using next-auth

interface JobDetailsProps {
  job: {
    title: string;
    company_name: string;
    address: string;
    description: string;
    summary: string;
    logo: string;

    experience_name?: string;

    salary_from: number;
    salary_to: number;
    currency?: string;

    posting_date: string;
    expired_date?: string;

    category_names: string[];
    culture_names: string[];
    skill_names: string[];

    gender?: string;
    region_name?: string;
    country_name?: string;

    applicants_count?: number;
    apply_url?: string;
    job_category_id?: number;
  };
}

const getCurrencySymbol = (currency?: string) => {
  if (!currency) return '';
  const map: Record<string, string> = {
    USD: '$',
    TZS: 'TZS',
    EUR: '€',
    GBP: '£',
  };
  return map[currency] || currency;
};

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [letter, setLetter] = useState('');
  const [applicantId, setApplicantId] = useState<string | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    } else {
      setApplicantId(null);
    }
  }, [session, status]);

  const logoSrc = job.logo
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${job.logo}`
    : '/default-logo.png';

  const currencySymbol = getCurrencySymbol(job.currency);

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : 'N/A';

  const handleApplyClick = () => {
    if (!applicantId) {
      alert('Only logged-in applicants can apply for this job.');
      return;
    }
    setShowTextBox(true);
  };

  const handleSaveJob = () => {
    if (!applicantId) {
      alert('Please log in to save the job.');
      return;
    }
    alert('Job saved successfully!');
  };

  const handleSubmitApplication = () => {
    if (!letter.trim()) {
      alert('Please write an application letter.');
      return;
    }
    alert('Application submitted successfully!');
    setShowTextBox(false);
    setLetter('');
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={10} className="mx-auto">

          {/* JOB HEADER */}
          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs="auto">
                  <img
                    src={logoSrc}
                    alt={job.company_name}
                    style={{ maxWidth: 120, objectFit: 'contain' }}
                  />
                </Col>
                <Col className="ms-3">
                  <h1 className="mb-2">{job.title}</h1>

                  <div className="text-muted mb-2">
                    <strong>{job.company_name}</strong> • {job.address}
                  </div>

                  <div className="mb-3">
                    <strong>Location:</strong> {job.region_name || 'Unknown'} • {job.country_name || 'Unknown'}
                    {job.gender && ` • Gender: ${job.gender}`}
                  </div>

                  <Row className="mt-3">
                    <Col xs="auto" className="me-4">
                      <div><FaBriefcase className="me-2" />{job.experience_name || 'Not specified'}</div>

                      <div className="mt-2">
                        <strong>{currencySymbol} {job.salary_from.toLocaleString()} – {job.salary_to.toLocaleString()}</strong> / Month
                      </div>

                      <div className="mt-2">
                        <FaCalendarCheck className="me-2" /> Posted: {formatDate(job.posting_date)}
                      </div>

                      {job.expired_date && (
                        <div className="mt-1">
                          <FaCalendarCheck className="me-2" /> Expires: {formatDate(job.expired_date)}
                        </div>
                      )}
                    </Col>

                    <Col xs="auto">
                      <div><FaList className="me-2" />{job.category_names?.join(', ') || 'Not Mentioned'}</div>

                      <div className="mt-2">
                        <FaCog className="me-2" />{job.culture_names?.length ? job.culture_names.join(', ') : 'No culture'}
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button onClick={handleApplyClick}>Apply Now</Button>
                    <Button variant="secondary" className="ms-2" onClick={handleSaveJob}>Save Job</Button>
                  </div>

                  {showTextBox && (
                    <div className="mt-4 p-3 border rounded bg-light">
                      <h5>Application Letter</h5>
                      <textarea
                        className="form-control"
                        rows={5}
                        value={letter}
                        onChange={(e) => setLetter(e.target.value)}
                        placeholder="Write your application letter..."
                      />
                      <div className="text-end mt-3">
                        <Button onClick={handleSubmitApplication}>Submit Application</Button>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* JOB CONTENT */}
          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <h3>Job Summary</h3>
              <div dangerouslySetInnerHTML={{ __html: job.summary }} />

              <h3 className="mt-4">Job Description</h3>
              <div dangerouslySetInnerHTML={{ __html: job.description }} />

              <h3 className="mt-4">Key Skills</h3>
              <div className="mb-3">
                {job.skill_names?.map((skill, i) => (
                  <span key={i} className="me-2 badge bg-light text-dark">{skill}</span>
                ))}
              </div>
            </Card.Body>

            {/* FOOTER */}
            <Card.Footer className="d-flex align-items-center">
              <div>
                <Button variant="link" onClick={handleSaveJob}><FaSave /></Button>
                <Button variant="link"><FaUsers /></Button>
                <Button variant="link" onClick={() => window.print()}><FaPrint /></Button>
              </div>

              <div className="ms-3">
                <form action="/job-search" method="post">
                  <input type="hidden" name="job_category[]" value={job.job_category_id} />
                  <Button variant="link" type="submit">Similar Jobs</Button>
                </form>
              </div>

              <div className="ms-auto text-muted">
                <FaEye /> {job.applicants_count || 0}
              </div>
            </Card.Footer>
          </Card>

        </Col>
      </Row>
    </Container>
  );
};

export default JobDetails;
