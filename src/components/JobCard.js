'use client';

import React from 'react';
import Link from 'next/link';

const JobCard = ({ imgSrc, title, company, location, date, jobType, jobId }) => {
  const logoStyle = {
    maxWidth: '40px',
    height: 'auto',
    objectFit: 'contain',
    transition: 'opacity 0.3s',
  };

  const cardBodyStyle = {
    padding: '1.25rem',
  };

  const jobTypeStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: jobType === 'Full-time' ? '#28a745' : '#007bff',
    color: '#fff',
    borderRadius: '25px',
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <div className="card-body" style={cardBodyStyle}>
          <div className="d-flex align-items-center mb-3">
            <div className="flex-shrink-0">
              <img
                src={imgSrc}
                alt={title}
                style={logoStyle}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="mb-0 text-capitalize">
                <Link href={`/job/${jobId}`} className="text-decoration-none text-dark">
                  {title}
                </Link>
              </h5>
              <div className="align-items-center">
                <span className="me-2">{company}</span>
              </div>
              <div>
                <span className="text-muted para-theme1">
                  <i className="bi bi-geo-alt"></i> {location}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div>
              <div className="text-muted para-theme1">{date}</div>
            </div>
            <div className="d-flex ms-auto">
              <div className="para-theme1">
                <span style={jobTypeStyle}>{jobType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
