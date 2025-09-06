'use client';

import React, { useState } from 'react';
import JobSearch from '../components/JobSearch';
import JobList from '../components/JobList';
import FeaturedRecruiters from '../components/FeaturedRecruiters';
import JobCategoryList from '../components/JobCategoryList';
import Layout from '../components/Layout';

const HomePage = () => {
  const [filters, setFilters] = useState({
    state: '',
    jobType: '',
    category: '',
    skills: [],
    experience: '',
    level: '',
  });

  const handleSearch = (newFilters) => {
    // For debugging: remove console.log before production
    console.log("Filters updated:", newFilters);
    setFilters(newFilters); // Update filters from JobSearch component
  };

  return (
    <Layout>
      <h1>Find Your Dream Job</h1>
      <JobSearch onSearch={handleSearch} />
      <JobList filters={filters} />
      {/* Uncomment when ready to use */}
      {/* <JobCategoryList /> */}
      {/* <FeaturedRecruiters /> */}
    </Layout>
  );
};

export default HomePage;
