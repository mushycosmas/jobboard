'use client';

import React, { useState } from 'react';
import { Button, ListGroup, Image, Pagination } from 'react-bootstrap';
import Link from 'next/link';  // For login/register links

interface Job {
  id: number;
  title: string;
  company_name: string;
  logo?: string;
  address: string;
  posting_date: string;
  url: string;
}

interface JobListProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onApply?: (job: Job) => void;       // Optional apply callback
  applicantId?: string | null;         // Logged-in applicant id
}

const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect, onApply, applicantId }) => {
  const itemsPerPage = 5; // Number of jobs per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLogoSrc = (logo?: string) => {
    return logo
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${logo}`
      : '/default-logo.png';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      {/* Login/Register Links */}
      <div className="mb-2">
        <Link href="/login" passHref>
          <Button variant="primary" className="me-3">Registered User</Button>
        </Link>
        <Link href="/register" passHref>
          <Button variant="outline-primary">New User</Button>
        </Link>
      </div>

      {/* Job Count */}
      <div style={{ color: '#2f7b15', fontSize: '0.875rem' }}>
        {jobs.length} Jobs Found.
      </div>

      {/* Job List */}
      <ListGroup>
        {currentJobs.map((job) => (
          <ListGroup.Item key={job.id} action onClick={() => onJobSelect(job)}>
            <div className="d-flex align-items-start py-3">
              <div className="me-3">
                <Image
                  src={getLogoSrc(job.logo)}
                  rounded
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
              </div>
              <div className="flex-grow-1">
                <h6 className="m-0">
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    {job.title}
                  </a>
                </h6>
                <div>{job.company_name}</div>
                <div>{job.address}</div>
                <div className="mt-1">
                  Posted: {formatDate(job.posting_date)}
                </div>

                {/* Apply Button for Logged-in Applicants */}
                {onApply && applicantId && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent selecting job
                        onApply(job);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default JobList;
