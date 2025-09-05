'use client';

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { fetchAllJobs } from '../api/api'; // Your API fetch function
import Link from 'next/link';

const JobList = ({ filters }) => {
  const [jobs, setJobs] = useState([]); // Store fetched jobs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [categoryId, setCategoryId] = useState(null); // Selected category ID

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      console.log('Fetching jobs for categoryId:', categoryId);

      try {
        const response = await fetchAllJobs(categoryId);
        setJobs(response);

        // Cache jobs with timestamp
        localStorage.setItem('jobs', JSON.stringify(response));
        localStorage.setItem('jobs_last_updated', Date.now().toString());
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [categoryId]);

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value ? parseInt(event.target.value) : null;
    console.log('Category selected:', selectedCategoryId);
    setCategoryId(selectedCategoryId);
  };

  // Filter jobs based on filters prop
  const filteredJobs = jobs.filter((job) => {
    const jobSkills = Array.isArray(job.skill_ids)
      ? job.skill_ids
      : job.skill_ids
      ? job.skill_ids.split(',').map((id) => id.trim())
      : [];

    const jobCategories = Array.isArray(job.category_ids)
      ? job.category_ids
      : job.category_ids
      ? job.category_ids.split(',').map((id) => id.trim())
      : [];

    return (
      (filters.state ? job.region_id === parseInt(filters.state) : true) &&
      (filters.jobType ? job.position_level_id === parseInt(filters.jobType) : true) &&
      (filters.category ? jobCategories.includes(filters.category) : true) &&
      (filters.skills.length > 0 ? filters.skills.every((skill) => jobSkills.includes(skill)) : true) &&
      (filters.experience ? job.experience_id === parseInt(filters.experience) : true)
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 d-flex align-items-center mb-3 mt-4">
          <h2 className="m-0 mpt-20" style={{ fontSize: '30px' }}>
            Latest Jobs
          </h2>
          <div className="d-flex ms-auto">
            <Link href="/all-jobs" passHref legacyBehavior>
              <a className="btn btn-text border">All Jobs</a>
            </Link>
          </div>
        </div>

        {/* Render JobCard for each filtered job */}
        {filteredJobs.slice(0, 8).map((job) => (
          <JobCard
            key={job.id}
            jobId={job.id}
            imgSrc={job.logo ? `http://localhost:4000${job.logo}` : 'https://via.placeholder.com/100'}
            title={job.title}
            company={job.company_name ? `${job.company_name}` : 'No employer'}
            location={job.address || 'No location specified'}
            date={new Date(job.posting_date).toLocaleDateString()}
            jobType="Full-time" // Adjust as needed
            link={job.id || '#'}
          />
        ))}
      </div>
    </div>
  );
};

export default JobList;
