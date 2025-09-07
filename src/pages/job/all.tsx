import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AllJobs from '../../components/AllJob';

const AllJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null); // Optional: make dynamic later

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);

      try {
        // 🔄 Fetch all jobs or filtered by category
        const url = categoryId
          ? `/api/jobs?categoryId=${categoryId}`
          : `/api/jobs`; // 👉 fetch all jobs without limit

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Failed to fetch jobs: ${res.status}`);
        }

        const data = await res.json();
        setJobs(data);

        // Optional: caching
        localStorage.setItem('jobs', JSON.stringify(data));
        localStorage.setItem('jobs_last_updated', Date.now().toString());
      } catch (err) {
        console.error(err);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [categoryId]);

  // 🕐 Loading state
  if (loading) return <div>Loading jobs...</div>;

  // ❌ Error state
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <h1>All Jobs</h1>
      <AllJobs jobs={jobs} />
    </Layout>
  );
};

export default AllJobsPage;
