'use client';

import React from 'react';
import Layout from '../components/Layout';
import AllIndustry from '../components/AllIndustry';

const AllIndustryPage = () => {
  return (
    <Layout>
      <div className="container mt-5 mt-sm-3"> {/* Applied margin to the container */}
        <AllIndustry />
      </div>
    </Layout>
  );
};

export default AllIndustryPage;
