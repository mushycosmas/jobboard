import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AllJobs from '../../components/AllJob';

const AllJobsPage = () => {
  const router = useRouter();
  const { categorySlug } = router.query; // dynamic route: /job/category/[categorySlug]
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return; // wait for slug

    const getJobs = async () => {
      setLoading(true);
      try {
        const url = categorySlug
          ? `/api/jobs?categorySlug=${categorySlug}` // filtered
          : `/api/jobs`; // all jobs

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [categorySlug, router.isReady]);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <h1>{categorySlug ? `Jobs in "${categorySlug.replace('-', ' ')}"` : 'All Jobs'}</h1>
      <AllJobs jobs={jobs} />
    </Layout>
  );
};

export default AllJobsPage;
