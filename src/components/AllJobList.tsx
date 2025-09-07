'use client';

import React, { useState } from 'react';
import { Button, ListGroup, Image, Pagination } from 'react-bootstrap';
import Link from 'next/link';  // Using next/link for routing

interface Job {
  id: number;
  title: string;
  company_name: string;
  logo: string;
  address: string;
  posting_date: string;
  url: string;
}

interface JobListProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect }) => {
  const itemsPerPage = 5; // Number of jobs per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Get the jobs for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="mb-2">
        <Link href="/login" passHref>
          <Button variant="primary" className="me-3">
            Registered User
          </Button>
        </Link>

        <Link href="/register" passHref>
          <Button variant="outline-primary">
            New User
          </Button>
        </Link>
      </div>
      
      <div style={{ color: '#2f7b15', fontSize: '0.875rem' }}>
        {jobs.length} Jobs Found.
      </div>

      <ListGroup>
        {currentJobs.map((job) => (
          <ListGroup.Item key={job.id} action onClick={() => onJobSelect(job)}>
            <div className="d-flex align-items-start py-3">
              <div className="me-3">
                <Image 
                  src={`http://localhost:4000${job.logo}`} 
                  rounded 
                  style={{ width: '50px', height: '50px' }} 
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
                <div className="mt-1">{job.posting_date}</div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default JobList;
