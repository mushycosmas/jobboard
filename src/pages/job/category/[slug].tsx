import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import AllJobs from '../../../components/AllJob';

export default function CategoryJobs() {
  const router = useRouter();
  const { categorySlug } = router.query;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const url = `/api/jobs?categorySlug=${categorySlug}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [categorySlug, router.isReady]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <h1>{categorySlug ? `Jobs in "${categorySlug.replace('-', ' ')}"` : 'All Jobs'}</h1>
      <AllJobs jobs={jobs} />
    </Layout>
  );
}
