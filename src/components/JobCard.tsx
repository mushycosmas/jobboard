'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const JobCard = ({ job }) => {
  const router = useRouter();

  const handleClick = () => {
    // Save job data in sessionStorage for client-side retrieval
    sessionStorage.setItem(`job-${job.slug}`, JSON.stringify(job));
    router.push(`/job/${job.slug}`);
  };

  // Determine logo URL
  const logoSrc =
    job.logo && job.logo !== 'NILL'
      ? job.logo.startsWith('http')
        ? job.logo
        : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/uploads/${job.logo.replace(/\\/g, '/')}`
      : '/default-logo.png'; // fallback image

  // Job type styling
  const jobType = job.job_type_name || 'Full-time';
  const jobTypeStyle = {
    padding: '0.4rem 0.8rem',
    backgroundColor: jobType.toLowerCase() === 'full-time' ? '#28a745' : '#007bff',
    color: '#fff',
    borderRadius: '25px',
    fontSize: '0.8rem',
  };

  return (
    <div className="col-md-4 mb-4" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="card h-100 shadow-sm hover-card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-shrink-0">
              <img
                src={logoSrc}
                alt={job.title}
                title={job.title}
                style={{
                  maxWidth: '40px',
                  height: 'auto',
                  objectFit: 'contain',
                  transition: 'opacity 0.3s',
                }}
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="mb-0 text-capitalize">{job.title}</h5>
              <div className="text-muted small">{job.company_name || 'No company listed'}</div>
              <div className="text-muted small">
                <i className="bi bi-geo-alt me-1" />
                {job.address || 'Location not specified'}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted small">
              {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : ''}
            </span>
            <span style={jobTypeStyle}>{jobType}</span>
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default JobCard;
