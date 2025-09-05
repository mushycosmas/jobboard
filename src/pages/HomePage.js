'use client'
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

    console.log("kelvin cosmas",newFilters)

    setFilters(newFilters); // Update filters based on user selection


   
  };

  return (
    <Layout>
      <h1>Find Your Dream Job</h1>
      <JobSearch onSearch={handleSearch} /> {/* Pass handleSearch to JobSearch */}
      <JobList filters={filters} /> {/* JobList uses current filters */}
      <JobCategoryList />
      <FeaturedRecruiters />
    </Layout>
  );
};

export default HomePage;
