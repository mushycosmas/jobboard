import React, { useState } from 'react';
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

interface JobDetailsProps {
  job: {
    title: string;
    company_name: string;
    address: string;
    description: string;
    summary: string;
    logo: string;
    experience_id: number;
    salary_from: number;
    salary_to: number;
    posting_date: string;
    category_names: string[];
    culture_names: string[];
    skill_names: string[];
  };
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [letter, setLetter] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mocking login status for now
  const [applicantId, setApplicantId] = useState(1); // Mocking applicantId for now

  // Logo inline style
  const logoStyle = {
    maxWidth: '120px',
    height: 'auto',
    objectFit: 'contain',
    transition: 'opacity 0.3s',
  };

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      alert('Please log in to apply.');
    } else {
      setShowTextBox(true);
    }
  };

  const handleSaveJob = () => {
    if (!isLoggedIn) {
      alert('Please log in to save the job.');
    } else {
      alert('Job saved successfully!');
    }
  };

  const handleSubmitApplication = async () => {
    if (!letter.trim()) {
      alert('Please write an application letter before submitting.');
      return;
    }
    // Handle form submission logic here
    alert('Application submitted successfully!');
    setShowTextBox(false);
    setLetter('');
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="card-custom" style={{ marginTop: '40px' }}>
            <Card.Body className="card-body-custom">
              <Row className="d-flex">
                <Col xs="auto" className="mb-2">
                  <a href="https://www.tryhirehub.com/company_profile.php" target="_blank" rel="noopener noreferrer">
                    <img
                      src={`http://localhost:4000${job.logo}`}
                      alt="Employer Logo"
                      className="employer-logo"
                      style={logoStyle}
                    />
                  </a>
                </Col>
                <Col className="flex-grow-1">
                  <h1 className="m-0">{job.title}</h1>
                  <div className="mt-2 mb-4">
                    <span className="mr-3">
                      <a
                        className="text-blue"
                        href="https://www.tryhirehub.com/company_details.php?query_string=b3a78199b6af866a4f72867b81684f77b7baab97889e"
                        title="View company profile"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {job.company_name}
                      </a>
                      <span className="mx-2">•</span>
                      <span>{job.address}</span>
                    </span>
                  </div>

                  <Row>
                    <Col xs="auto" className="me-4">
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
                        {job.category_names?.join(', ') || 'Not Mentioned'}
                      </div>
                      <div className="mb-1">
                        <FaCog className="me-2" />
                        {job.culture_names?.length ? job.culture_names.join(', ') : 'No culture'}
                      </div>
                    </Col>
                  </Row>

                  <div className="my-4">
                    <Button variant="primary" onClick={handleApplyClick}>
                      Apply Now
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={handleSaveJob}>
                      Save Job
                    </Button>
                  </div>

                  <hr />

                  {showTextBox && (
                    <div className="mt-3 p-3 border rounded shadow-sm bg-light">
                      <h5 className="mb-3 text-primary">Application Letter</h5>
                      <textarea
                        className="form-control"
                        placeholder="Write your application letter..."
                        value={letter}
                        onChange={(e) => setLetter(e.target.value)}
                        rows={5}
                      />
                      <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-primary px-4" onClick={handleSubmitApplication}>
                          Submit Application
                        </button>
                      </div>
                    </div>
                  )}

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
                  <div className="skill-tag">{job.skill_names?.join(', ') || 'Not Mentioned'}</div>
                </Col>
              </Row>
            </Card.Body>

            <Card.Footer className="card-footer-custom text-center" style={{ borderTop: '1px solid #e6e9ec' }}>
              <div className="d-inline" role="group" aria-label="Basic example">
                <Button variant="link" href="https://www.tryhirehub.com/20890800/Virtual-Licensed-Clinical-Therapist-Apply-in-minutes-?action=save">
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
                <form name="search_similar_job" action="https://www.tryhirehub.com/job-search/" method="post">
                  <input type="hidden" name="action" value="search" />
                  <input type="hidden" name="job_category[]" value="1" />
                  <Button variant="link" type="submit" title="View Similar jobs of this category">
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
        </Col>
      </Row>
    </Container>
  );
};

export default JobDetails;
