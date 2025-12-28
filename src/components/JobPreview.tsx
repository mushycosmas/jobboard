'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { FaBriefcase, FaCalendarCheck, FaList, FaCog, FaSave, FaPrint, FaEye, FaShareAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { incrementJobView } from '@/utils/jobView'; // adjust path if necessary

interface Job {
  id: number;
  slug: string;
  title: string;
  company_name: string;
  logo?: string;
  company_url?: string;
  address: string;
  salary_from?: number;
  salary_to?: number;
  posting_date: string;
  experience_id?: number;
  category_names?: string[] | null;
  culture_names?: string[] | null;
  skill_names?: string[] | null;
  summary?: string;
  description?: string;
  url?: string;
  views?: number;
}

interface JobPreviewProps {
  job: Job;
  applicantId?: string | null;
}

const JobPreview: React.FC<JobPreviewProps> = ({ job, applicantId }) => {
  const { data: session } = useSession();
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [error, setError] = useState('');
  const [showTextBox, setShowTextBox] = useState(false);
  const [letter, setLetter] = useState('');
  const [views, setViews] = useState<number>(job.views || 0);

  const getLogoSrc = (logo?: string) =>
    logo ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${logo}` : '/default-logo.png';

  // Increment job view using slug
  useEffect(() => {
    if (job?.slug) {
      incrementJobView(job.slug)
        .then((count) => setViews(count ?? views))
        .catch((err) => console.error('Failed to increment job view:', err));
    }
  }, [job?.slug]);

  // APPLY LOGIC (use id)
  const handleApply = () => {
    if (!applicantId) {
      alert('Only logged-in applicants can apply for this job.');
      return;
    }

    if (job.url && job.url.trim() !== '') {
      window.open(job.url, '_blank');
    } else {
      setShowTextBox(true);
    }
  };

  const handleSubmitApplication = () => {
    if (!letter.trim()) {
      alert('Please write your cover letter.');
      return;
    }
    alert('Application submitted successfully!');
    setLetter('');
    setShowTextBox(false);
  };

  // SAVE JOB (use id)
  const handleSaveJob = async () => {
    if (!session) {
      alert('Please log in to save this job.');
      return;
    }

    try {
      const response = await fetch('/api/saveJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, userId: session.user.id }),
      });

      if (response.ok) setIsJobSaved(true);
      else throw new Error('Failed to save the job');
    } catch {
      setError('Error saving job. Please try again later.');
    }
  };

  // PRINT
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write('<html><head><title>Job Details</title><style>');
    printWindow?.document.write(`
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { font-size: 24px; }
      p { font-size: 16px; margin: 5px 0; }
      .job-section { margin-bottom: 20px; }
    `);
    printWindow?.document.write('</style></head><body>');
    printWindow?.document.write(`
      <h1>${job.title}</h1>
      <div class="job-section">
        <p><strong>Company:</strong> ${job.company_name}</p>
        <p><strong>Location:</strong> ${job.address}</p>
        <p><strong>Salary:</strong> ${job.salary_from || 'N/A'} - ${job.salary_to || 'N/A'}</p>
        <p><strong>Posted on:</strong> ${new Date(job.posting_date).toLocaleDateString()}</p>
      </div>
      <h2>Summary</h2>
      <div>${job.summary || 'Not available'}</div>
      <h2>Description</h2>
      <div>${job.description || 'Not available'}</div>
      <h2>Skills</h2>
      <div>${Array.isArray(job.skill_names) ? job.skill_names.join(', ') : 'Not Mentioned'}</div>
    `);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  };

  // SHARE
  const handleShare = async () => {
    const shareText = `Check out this job: ${job.title} at ${job.company_name}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: job.title, text: shareText, url: shareUrl });
      } catch (err) {
        console.error(err);
      }
    } else {
      window.open(`mailto:?subject=Check out this job&body=${encodeURIComponent(shareText)} ${encodeURIComponent(shareUrl)}`, '_blank');
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)} ${encodeURIComponent(shareUrl)}`, '_blank');
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    }
  };

  return (
    <Card>
      <Card.Body style={{ maxHeight: '850px', overflowY: 'auto' }}>
        <Row className="d-flex align-items-start">
          <Col xs="auto" className="mb-3 text-center">
            <a href={job.company_url || '#'}>
              <img src={getLogoSrc(job.logo)} alt="Employer Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </a>
          </Col>
          <Col>
            <h1>{job.title}</h1>
            <div className="mt-2 mb-4">
              <a className="text-primary" href={job.company_url || '#'}>{job.company_name}</a>
              <span className="mx-2">•</span>
              <span>{job.address}</span>
            </div>

            <Row>
              <Col xs="auto">
                <div className="mb-1"><FaBriefcase className="me-2" />{job.experience_id === 1 ? 'Any experience' : 'Experienced'}</div>
                <div className="mb-1">{job.salary_from || 'N/A'} - {job.salary_to || 'N/A'} per annum</div>
                <div className="mb-1"><FaCalendarCheck className="me-2" />Posted: {new Date(job.posting_date).toLocaleDateString()}</div>
              </Col>
              <Col xs="auto">
                <div className="mb-1"><FaList className="me-2" />{(job.category_names ?? []).join(', ') || 'No categories'}</div>
                <div className="mb-1"><FaCog className="me-2" />{(job.culture_names ?? []).join(', ') || 'No culture'}</div>
              </Col>
            </Row>

            <div className="my-4">
              <Button variant="primary" onClick={handleApply}>Apply Now</Button>
            </div>

            {showTextBox && (
              <div className="mt-3 p-3 border rounded bg-light">
                <h5>Cover Letter</h5>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  placeholder="Write your cover letter..."
                />
                <div className="text-end mt-2">
                  <Button onClick={handleSubmitApplication}>Submit Application</Button>
                </div>
              </div>
            )}

            <hr />
          </Col>
        </Row>

        <h3 className="pt-3 pb-2">Job Summary</h3>
        <div dangerouslySetInnerHTML={{ __html: job.summary || 'Not available' }} />

        <h3 className="pt-3 pb-2">Job Description</h3>
        <div dangerouslySetInnerHTML={{ __html: job.description || 'Not available' }} />

        <h3 className="pt-3 pb-2">Keyskills</h3>
        <div>{(job.skill_names ?? []).join(', ') || 'Not Mentioned'}</div>

        {error && <Alert variant="danger">{error}</Alert>}
      </Card.Body>

      <Card.Footer className="text-center">
        <Button variant="link" onClick={handleSaveJob}><FaSave /> {isJobSaved ? 'Saved' : 'Save'}</Button>
        <Button variant="link" onClick={handleShare}><FaShareAlt /></Button>
        <Button variant="link" onClick={handlePrint}><FaPrint /></Button>
        <span className="mx-4 text-muted"><FaEye /> {views} Views</span>
      </Card.Footer>
    </Card>
  );
};

export default JobPreview;
