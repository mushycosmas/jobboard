'use client';

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import Link from 'next/link';

const JobList = ({ filters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

useEffect(() => {
  const getJobs = async () => {
    setLoading(true);
    try {
      const url = categoryId
        ? `/api/jobs?categoryId=${categoryId}&limit=12`
        : `/api/jobs?limit=12`; // Add default limit

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch jobs: ${res.status}`);
      }

      const response = await res.json();
      setJobs(response);

      // Optional caching
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
    const selectedCategoryId = event.target.value
      ? parseInt(event.target.value)
      : null;
    setCategoryId(selectedCategoryId);
  };

  const skillsFilter = filters.skills || [];

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
      (filters.jobType
        ? job.position_level_id === parseInt(filters.jobType)
        : true) &&
      (filters.category
        ? jobCategories.includes(filters.category.toString())
        : true) &&
      (skillsFilter.length > 0
        ? skillsFilter.every((skill) => jobSkills.includes(skill.toString()))
        : true) &&
      (filters.experience
        ? job.experience_id === parseInt(filters.experience)
        : true)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 d-flex align-items-center mb-3 mt-4">
          <h2 className="m-0 mpt-20" style={{ fontSize: '30px' }}>
            Latest Jobs
          </h2>
          <div className="d-flex ms-auto">
            <Link href="/job/all" className="btn btn-text border">
              All Jobs
            </Link>
          </div>
        </div>

        {filteredJobs.slice(0, 8).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
