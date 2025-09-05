'use client'
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaBriefcase, FaCalendarCheck, FaList, FaCog, FaSave, FaUsers, FaPrint, FaEye } from 'react-icons/fa';

const JobPreview = ({ job }) => {
  return (
    <Card>
      <Card.Body
        style={{
          maxHeight: '850px', // Set default height for card body
          overflowY: 'auto', // Make the body scrollable if the content exceeds
        }}
      >
        <Row className="d-flex">
          {/* Logo Section at the Top */}
          <Col xs="auto" className="mb-3 text-center">
            <a href="https://www.tryhirehub.com/company_profile.php">
              <img
                src={`http://localhost:4000${job.logo}`} // Dynamically set the logo URL
                alt="Employer Logo"
                style={{ width: '80px', height: '80px', objectFit: 'contain' }} // Apply custom logo size style
              />
            </a>
          </Col>

          {/* Job Title and Company Info */}
          <Col>
            <h1 className="m-0">{job.title}</h1>
            <div className="mt-2 mb-4">
              <span className="mr-3">
                <a
                  className="text-primary"
                  href="https://www.tryhirehub.com/company_details.php?query_string=b3a78199b6af866a4f72867b81684f77b7baab97889e"
                  title="View company profile"
                >
                  {job.company_name}
                </a>
                <span className="mx-2">•</span>
                <span>{job.address}</span>
              </span>
            </div>

            {/* Experience, Salary, Posted, Category */}
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
                  {job.category_names.join(', ')}
                </div>
                <div className="mb-1">
                  <FaCog className="me-2" />
                  {job.culture_names.length ? job.culture_names.join(', ') : 'No culture'}
                </div>
              </Col>
            </Row>

            {/* Apply Now Button */}
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

            {/* Horizontal Line to separate sections */}
            <hr />
          </Col>
        </Row>

        {/* Job Summary, Description, and Keyskills */}
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
        <div className="skill-tag">{job.skill_names.join(', ') || 'Not Mentioned'}</div>
      </Card.Body>

      <Card.Footer className="text-center">
        <div className="d-inline" role="group" aria-label="Basic example">
          <Button variant="link" href={`https://www.tryhirehub.com/20890800/Virtual-Licensed-Clinical-Therapist-Apply-in-minutes-?action=save`}>
            <FaSave />
          </Button>

          <Button variant="link" href="https://www.tryhirehub.com/tell_to_friend.php?query_string=b3a78199b6af866a4f72867b81684f77b7baab97889e">
            <FaUsers />
          </Button>

          <Button
            variant="link"
            onClick={() =>
              window.open('https://www.tryhirehub.com/20890800/Virtual-Licensed-Clinical-Therapist-Apply-in-minutes-?action=print')
            }
          >
            <FaPrint />
          </Button>
        </div>

        <div className="btn-group" role="group" aria-label="Basic example">
          <form name="search_smililar_job" action="https://www.tryhirehub.com/job-search/" method="post">
            <input type="hidden" name="action" value="search" />
            <input type="hidden" name="job_category[]" value="1" />
            <Button variant="link" onClick={() => document.search_smililar_job.submit()} title="View Similar jobs of this category">
              Similar Jobs
            </Button>
          </form>
        </div>

        <div className="btn-group" role="group" aria-label="Basic example">
          <span className="addViewJobsToButtonGroup mx-4 text-muted">
            <FaEye />
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default JobPreview;
