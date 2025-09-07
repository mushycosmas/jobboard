'use client';

import { useRouter } from 'next/navigation';

const JobCard = ({ job }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/job/${job.slug}`);
    sessionStorage.setItem(`job-${job.slug}`, JSON.stringify(job));
  };

  const logoSrc = job.logo
    ? `http://localhost:4000${job.logo}`
    : 'https://via.placeholder.com/100';

  const jobType = job.job_type || 'Full-time';

  const jobTypeStyle = {
    padding: '0.4rem 0.8rem',
    backgroundColor: jobType === 'Full-time' ? '#28a745' : '#007bff',
    color: '#fff',
    borderRadius: '25px',
    fontSize: '0.8rem',
  };

  return (
    <div className="col-md-4 mb-4" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="card h-100 shadow-sm">
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
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
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
              {new Date(job.posting_date).toLocaleDateString()}
            </span>
            <span style={jobTypeStyle}>{jobType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
