'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Container,
  Alert,
  Spinner,
} from 'react-bootstrap';
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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { incrementJobView } from '@/utils/jobView';
import {
  checkAlreadyApplied,
  submitApplication,
  checkAlreadySaved,
  saveJob,
} from '@/utils/jobActions';

interface JobDetailsProps {
  job: {
    id: number;
    slug: string;
    views?: number;
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

const currencyMap: Record<string, string> = {
  USD: '$',
  TZS: 'TZS',
  EUR: '€',
  GBP: '£',
};

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const viewedRef = useRef(false);

  const [applicantId, setApplicantId] = useState<string | null>(null);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  const [alreadySaved, setAlreadySaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [savingJob, setSavingJob] = useState(false);

  const [showTextBox, setShowTextBox] = useState(false);
  const [letter, setLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.applicantId) {
      setApplicantId(String(session.user.applicantId));
    } else {
      setApplicantId(null);
    }
  }, [session, status]);

  useEffect(() => {
    if (!router.isReady || viewedRef.current) return;
    const slug = router.query.slug as string;
    if (!slug) return;
    viewedRef.current = true;
    incrementJobView(slug);
  }, [router.isReady, router.query.slug]);

  useEffect(() => {
    if (!applicantId || !job?.id) {
      setCheckingApplication(false);
      setCheckingSaved(false);
      return;
    }

    const fetchStatus = async () => {
      setCheckingApplication(true);
      setCheckingSaved(true);
      setAlreadyApplied(await checkAlreadyApplied(applicantId, job.id));
      setAlreadySaved(await checkAlreadySaved(applicantId, job.id));
      setCheckingApplication(false);
      setCheckingSaved(false);
    };

    fetchStatus();
  }, [applicantId, job.id]);

  const logoSrc = job.logo
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${job.logo}`
    : '/default-logo.png';

  const currencySymbol = job.currency ? currencyMap[job.currency] || job.currency : '';
  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : 'N/A');

  const handleApplyClick = () => {
    if (!applicantId) return alert('Please log in as an applicant to apply.');
    if (alreadyApplied) return alert('You have already applied for this job.');
    if (job.apply_url) return window.open(job.apply_url, '_blank');
    setShowTextBox(true);
  };

  const handleSubmitApplication = async () => {
    if (!letter.trim()) return setError('Application letter is required.');
    try {
      setSubmitting(true);
      setError(null);
      await submitApplication(applicantId!, job.id, letter);
      setAlreadyApplied(true);
      setLetter('');
      setShowTextBox(false);
      alert('✅ Application submitted successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveJob = async () => {
    if (!applicantId) return alert('Please log in as an applicant to save jobs.');
    if (alreadySaved) return;
    try {
      setSavingJob(true);
      await saveJob(applicantId, job.id);
      setAlreadySaved(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingJob(false);
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={10} className="mx-auto">
          <Card className="mb-5 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs="auto">
                  <img src={logoSrc} alt={job.company_name} style={{ maxWidth: 120, objectFit: 'contain' }} />
                </Col>
                <Col className="ms-3">
                  <h1>{job.title}</h1>
                  <p className="text-muted"><strong>{job.company_name}</strong> • {job.address}</p>
                  <p>{job.region_name} • {job.country_name}{job.gender && ` • Gender: ${job.gender}`}</p>

                  <Row className="mt-3">
                    <Col>
                      <FaBriefcase /> {job.experience_name || 'Not specified'}
                      <div className="mt-2"><strong>{currencySymbol} {job.salary_from.toLocaleString()} – {job.salary_to.toLocaleString()}</strong> / Month</div>
                      <div className="mt-2"><FaCalendarCheck /> Posted: {formatDate(job.posting_date)}</div>
                      {job.expired_date && <div><FaCalendarCheck /> Expires: {formatDate(job.expired_date)}</div>}
                    </Col>
                    <Col>
                      <FaList /> {job.category_names.join(', ')}
                      <div className="mt-2"><FaCog /> {job.culture_names.length ? job.culture_names.join(', ') : 'No culture'}</div>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button
                      onClick={handleApplyClick}
                      disabled={alreadyApplied || checkingApplication}
                      variant={alreadyApplied ? 'success' : 'primary'}
                    >
                      {checkingApplication ? 'Checking...' : alreadyApplied ? 'Applied' : 'Apply Now'}
                    </Button>

                    <Button
                      variant={alreadySaved ? 'success' : 'secondary'}
                      className="ms-2"
                      onClick={handleSaveJob}
                      disabled={alreadySaved || checkingSaved || savingJob}
                    >
                      {checkingSaved ? 'Checking...' : alreadySaved ? 'Saved' : savingJob ? 'Saving...' : 'Save Job'}
                    </Button>
                  </div>

                  {showTextBox && !alreadyApplied && (
                    <div className="mt-4 p-3 border rounded bg-light">
                      <h5>Application Letter</h5>
                      {error && <Alert variant="danger">{error}</Alert>}
                      <textarea
                        className="form-control"
                        rows={5}
                        value={letter}
                        onChange={(e) => setLetter(e.target.value)}
                        placeholder="Write your application letter..."
                      />
                      <div className="text-end mt-3">
                        <Button onClick={handleSubmitApplication} disabled={submitting}>
                          {submitting ? <><Spinner size="sm" className="me-2" />Submitting...</> : 'Submit Application'}
                        </Button>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h3>Job Summary</h3>
              <div dangerouslySetInnerHTML={{ __html: job.summary }} />
              <h3 className="mt-4">Job Description</h3>
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
              <h3 className="mt-4">Key Skills</h3>
              {job.skill_names.map((skill, i) => <span key={i} className="badge bg-light text-dark me-2">{skill}</span>)}
            </Card.Body>

            <Card.Footer className="d-flex align-items-center">
              <div>
                <Button variant="link" disabled={alreadySaved} onClick={handleSaveJob} title={alreadySaved ? 'Already Saved' : 'Save Job'}>
                  <FaSave color={alreadySaved ? 'green' : undefined} />
                </Button>
                <Button variant="link"><FaUsers /></Button>
                <Button variant="link" onClick={() => window.print()}><FaPrint /></Button>
              </div>
              <div className="ms-auto text-muted"><FaEye /> {job.views ?? 0} views</div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default JobDetails;
