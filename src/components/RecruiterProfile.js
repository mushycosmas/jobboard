'use client'
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAllEmployerJob } from "../api/api";
import { Spinner, Alert, Button, Form } from "react-bootstrap";

const RecruiterProfile = () => {
  const { id } = useParams(); // Get recruiter ID from the route
  const [recruiterData, setRecruiterData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testLimit, setTestLimit] = useState(5); // Limiting job count for demonstration

  const stripHtmlTags = (htmlString) => {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEmployers = await fetchAllEmployerJob(id);

        const recruiter = allEmployers.find(
          (employer) => employer.employer_id === parseInt(id)
        );

        if (recruiter) {
          setRecruiterData({
            name: recruiter.company_name,
            logo: recruiter.logo
              ? `http://localhost:4000${recruiter.logo}`
              : "https://via.placeholder.com/150",
            email: recruiter.emailAddress || "Not provided",
            location: recruiter.address || "Location not available",
          });

          setJobs(
            allEmployers.slice(0, testLimit).map((job) => ({
              id: job.id,
              title: job.title,
              description: job.summary || "No description provided",
              datePosted: job.posting_date
                ? job.posting_date.split("T")[0]
                : "Date not available",
              expiredDate: job.expired_date,
              logo: recruiter.logo,  // Adding the recruiter logo to job data
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching recruiter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, testLimit]);

  // Function to check if the job is expired
  const isExpired = (expiredDate) => {
    const currentDate = new Date();
    const expiryDate = new Date(expiredDate);
    return expiryDate < currentDate;
  };

  // Function to format date to human-readable format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="container my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading recruiter profile...</p>
      </div>
    );
  }

  if (!recruiterData) {
    return (
      <div className="container my-4 text-center">
        <Alert variant="danger">
          <h4>Recruiter profile not found</h4>
          <p>Please check the link or try again later.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container" style={{'marginTop':'90px'}}>
      <div className="row">
        {/* Sidebar Section */}
        <div className="col-12 col-sm-12 col-md-3 mb-3">
          <div className="card shadow-sm border-light">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#276795', borderRadius: '0.25rem 0.25rem 0 0', padding: '0.75rem 1rem' }}>
              <h6 className="mb-0 font-weight-bold" style={{ fontSize: '1rem' }}>Filters</h6>
            </div>
            <div className="p-3">
              <h6 className="font-weight-bold text-primary">Search Jobs</h6>
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Search by job title..."
                  className="mb-3"
                />
                <Button variant="outline-primary" block>
                  Search
                </Button>
              </Form>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="col-12 col-sm-12 col-md-6 mb-3">
          <div className="card shadow-sm border-light mb-3">
            <div className="row no-gutters align-items-center p-2">
              {/* Recruiter Logo Section */}
              <div className="col-md-3 d-flex justify-content-center">
                <img
                  src={recruiterData.logo}
                  alt={recruiterData.name}
                  className="img-fluid rounded-circle"
                  style={{ height: '50px', width: '50px' }}
                />
              </div>

              {/* Recruiter Info Section */}
              <div className="col-md-6">
                <h5 className="text-primary font-weight-bold mb-2" style={{ fontSize: '1rem', maxWidth: '200px' }}>
                  {recruiterData.name}
                </h5>
                <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                  {recruiterData.location}
                </p>
                <p className="mb-1 text-muted small">{recruiterData.email}</p>
              </div>

              {/* Action Button Section */}
              {/* <div className="col-md-3 d-flex justify-content-end">
                <Link to="/" className="btn btn-outline-primary btn-sm">View Profile</Link>
              </div> */}
            </div>
          </div>

          {/* Job Listings Section */}
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="card mb-3 shadow-sm border-light">
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    {/* Job Logo */}
                    <div className="col-3 d-flex justify-content-center">
                      <img
                        src={job.logo ? `http://localhost:4000${job.logo}` : "https://via.placeholder.com/150"}
                        alt="Recruiter Logo"
                        className="img-fluid rounded-circle"
                        style={{ height: '40px', width: '40px' }}
                      />
                    </div>

                    {/* Job Info */}
                    <div className="col-6">
  <h5 style={{ marginTop: '5px' }}>{job.title}</h5>
  <p className="job-description" style={{ marginTop: '5px' }}>
    {stripHtmlTags(job.description)}
  </p>
  <p
    className={`expired-date ${isExpired(job.expiredDate) ? 'text-danger' : ''}`}
    style={{ fontSize: '0.9rem', marginTop: '5px' }}
  >
    {job.expiredDate ? `Expires on: ${formatDate(job.expiredDate)}` : 'No expiry date'}
  </p>
</div>



                    {/* View Button */}
                    <div className="col-3 d-flex justify-content-end">
                      <Link to={`/job/${job.id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card mb-3 shadow-sm border-light">
              <div className="card-body">
                <p>No jobs listed yet</p>
              </div>
            </div>
          )}

          {/* Job Description Limit */}
          <style>
            {`
              .job-description {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* Limit to two lines */
                -webkit-box-orient: vertical;
              }
              .expired-date {
                margin-top: 10px;
              }
              .text-danger {
                color: red;
              }
            `}
          </style>

          {/* Test Limit - Displaying the number of jobs fetched */}
          <div className="mt-3">
            <p>Showing {jobs.length} out of {testLimit} job listings</p>
          </div>
        </div>

        {/* Banner Section */}
        <div className="col-12 col-sm-12 col-md-3 mb-3">
          {/* Placeholder for banner if needed */}
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
