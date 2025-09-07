'use client';

import React, { useState, useContext } from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { FaBriefcase, FaCalendarCheck, FaList, FaCog, FaSave, FaUsers, FaPrint, FaEye, FaShareAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react'; // Assuming you're using next-auth for authentication

const JobPreview = ({ job }) => {
  const { data: session } = useSession(); // Assuming session data contains user info (check if user is logged in)
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [error, setError] = useState('');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write('<html><head><title>Job Details</title><style>');
    printWindow?.document.write(`
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      h1 {
        font-size: 24px;
      }
      p {
        font-size: 16px;
        margin: 5px 0;
      }
      .job-details {
        margin-bottom: 20px;
      }
      .job-summary, .job-description {
        margin-bottom: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
        color: #777;
      }
    `);
    printWindow?.document.write('</style></head><body>');
    printWindow?.document.write(`
      <h1>${job.title}</h1>
      <div class="job-details">
        <p><strong>Company:</strong> ${job.company_name}</p>
        <p><strong>Location:</strong> ${job.address}</p>
        <p><strong>Salary:</strong> ${job.salary_from} - ${job.salary_to} per annum</p>
        <p><strong>Posted on:</strong> ${new Date(job.posting_date).toLocaleDateString()}</p>
        <p><strong>Experience Required:</strong> ${job.experience_id === 1 ? 'Any experience' : 'Experienced'}</p>
      </div>
    `);
    printWindow?.document.write(`
      <h2>Job Summary</h2>
      <div class="job-summary">${job.summary}</div>
    `);
    printWindow?.document.write(`
      <h2>Job Description</h2>
      <div class="job-description">${job.description}</div>
    `);
    printWindow?.document.write(`
      <h2>Keyskills</h2>
      <div class="job-skills">${Array.isArray(job.skill_names) ? job.skill_names.join(', ') : 'Not Mentioned'}</div>
    `);
    printWindow?.document.write(`
      <div class="footer">This job was posted on ${new Date(job.posting_date).toLocaleDateString()}</div>
    `);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job at ${job.company_name}`,
          url: window.location.href, // Or you can use the job.url if available
        });
        console.log('Job shared successfully');
      } catch (error) {
        console.error('Error sharing the job:', error);
      }
    } else {
      const shareUrl = encodeURIComponent(window.location.href);
      const shareText = encodeURIComponent(`Check out this job: ${job.title} at ${job.company_name}`);
      const emailLink = `mailto:?subject=Check out this job&body=${shareText} %0A ${shareUrl}`;
      const twitterLink = `https://twitter.com/intent/tweet?text=${shareText} ${shareUrl}`;
      const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      
      window.open(emailLink, '_blank'); // Email
      window.open(twitterLink, '_blank'); // Twitter
      window.open(facebookLink, '_blank'); // Facebook
    }
  };

  const handleSaveJob = async () => {
    if (!session) {
      // If the user is not logged in, prompt to log in
      alert('Please log in to save this job.');
      return;
    }

    try {
      // Assuming you have an API route to save the job
      const response = await fetch('/api/saveJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: job.id, userId: session.user.id }),
      });

      if (response.ok) {
        setIsJobSaved(true);
        setError('');
      } else {
        throw new Error('Failed to save the job');
      }
    } catch (error) {
      setError('An error occurred while saving the job. Please try again later.');
    }
  };

  return (
    <Card>
      <Card.Body
        style={{
          maxHeight: '850px',
          overflowY: 'auto',
        }}
      >
        <Row className="d-flex">
          <Col xs="auto" className="mb-3 text-center">
            <a href={job.company_url || '#'}>
              <img
                src={`http://localhost:4000${job.logo}`}
                alt="Employer Logo"
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              />
            </a>
          </Col>

          <Col>
            <h1 className="m-0">{job.title}</h1>
            <div className="mt-2 mb-4">
              <span className="mr-3">
                <a
                  className="text-primary"
                  href={job.company_url || '#'}
                  title="View company profile"
                >
                  {job.company_name}
                </a>
                <span className="mx-2">•</span>
                <span>{job.address}</span>
              </span>
            </div>

            <Row>
              <Col xs="auto" className="mb-2">
                <div className="mb-1">
                  <FaBriefcase className="me-2" />
                  {job.experience_id === 1 ? 'Any experience' : 'Experienced'}
                </div>
                <div className="mb-1">
                  {job.salary_from} - {job.salary_to} per annum
                </div>
                <div className="mb-1">
                  <FaCalendarCheck className="me-2" />
                  Posted: {new Date(job.posting_date).toLocaleDateString()}
                </div>
              </Col>
              <Col xs="auto">
                <div className="mb-1">
                  <FaList className="me-2" />
                  {Array.isArray(job.category_names) && job.category_names.length > 0
                    ? job.category_names.join(', ')
                    : 'No categories'}
                </div>
                <div className="mb-1">
                  <FaCog className="me-2" />
                  {Array.isArray(job.culture_names) && job.culture_names.length > 0
                    ? job.culture_names.join(', ')
                    : 'No culture'}
                </div>
              </Col>
            </Row>

            <div className="my-4">
              <Button
                variant="primary"
                onClick={() =>
                  window.open(job.url || 'https://www.adzuna.com/land/ad/5001569010', '_blank')
                }
              >
                Apply Now
              </Button>
            </div>

            <hr />
          </Col>
        </Row>

        <h3 className="pt-3 pb-2" style={{ fontSize: '1.2rem' }}>
          Job Summary
        </h3>
        <div className="job-summary" dangerouslySetInnerHTML={{ __html: job.summary }} />

        <h3 className="pt-3 pb-2" style={{ fontSize: '1.2rem' }}>
          Job Description
        </h3>
        <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />

        <h3 className="pt-3 pb-2" style={{ fontSize: '1.2rem' }}>
          Keyskills
        </h3>
        <div className="skill-tag">
          {Array.isArray(job.skill_names) ? job.skill_names.join(', ') : 'Not Mentioned'}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
      </Card.Body>

      <Card.Footer className="text-center">
        <div className="d-inline" role="group" aria-label="Basic example">
          <Button variant="link" onClick={handleSaveJob}>
            <FaSave />
            {isJobSaved ? 'Saved' : 'Save'}
          </Button>

          <Button variant="link" onClick={handleShare}>
            <FaShareAlt />
          </Button>

          <Button variant="link" onClick={handlePrint}>
            <FaPrint />
          </Button>
        </div>

        <div className="btn-group" role="group" aria-label="Basic example">
          <span className="addViewJobsToButtonGroup mx-4 text-muted">
            <FaEye />
            View More Jobs
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default JobPreview;
