import React, { useEffect, useState } from 'react';
import { saveJob, deleteSavedJob, getSavedJobs } from '../../api/api'; // Adjust the path as necessary
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link for routing
import moment from 'moment';

const JobComponent = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const applicantId = localStorage.getItem('applicantId'); // Assuming you store the applicant ID in localStorage

  useEffect(() => {
    if (applicantId) {
      fetchSavedJobs();
    }
  }, [applicantId]);

  const fetchSavedJobs = async () => {
    try {
      const jobs = await getSavedJobs(applicantId);
      setSavedJobs(jobs.data); // Assuming the structure of your response is as mentioned
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleDeleteJob = async (savedJobId, e) => {
    e.stopPropagation(); // Prevent the card click event from firing
    try {
      const result = await deleteSavedJob(savedJobId);
      console.log("Saved job deleted successfully:", result);
      fetchSavedJobs(); // Refresh saved jobs list
    } catch (error) {
      console.error("Error deleting saved job:", error);
    }
  };

  // Internal CSS for card hover effect
  const cardStyle = {
    transition: 'box-shadow 0.3s ease-in-out',
    cursor: 'pointer', // Change cursor to pointer for clickable card
  };

  const hoverStyle = {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Saved Jobs</h3>
      <Row xs={1} md={3} className="g-4">
        {savedJobs.map((job) => (
          <Col key={job.id}>
            <Card
              className="shadow-sm border-light h-100"
              style={cardStyle}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = hoverStyle.boxShadow)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <Card.Body>
                <Card.Title className="h5">{job.title}</Card.Title>
                <Card.Text>
                  <strong>Posting Date:</strong> {moment(job.posting_date).format("MMMM Do YYYY")}
                  <br />
                  <strong>Expired Date:</strong> {moment(job.expired_date).format("MMMM Do YYYY")}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Button 
                    variant="danger" 
                    onClick={(e) => handleDeleteJob(job.id, e)}
                  >
                    Delete
                  </Button>
                  <Link to={`/job/${job.job_id}`} className="btn btn-primary">
                    View Job
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default JobComponent;
