import React, { useState ,useEffect} from 'react';
import { fetchAllJobs } from '../../api/api'; 

import AllJobs from '../../components/AllJob';
import Layout from '../../components/Layout';

const AllJobsPage = () => {
  const [jobs, setJobs] = useState([]); // To store the fetched jobs
   const [loading, setLoading] = useState(true); // To manage loading state
   const [error, setError] = useState(null); // To manage error state
   const [categoryId, setCategoryId] = useState(null); // State for categoryId
 
   // Fetch jobs when categoryId changes or on initial load
   useEffect(() => {
     const getJobs = async () => {
       setLoading(true);
       console.log('Fetching jobs for categoryId:', categoryId); // Debugging log
 
       try {
         // Fetch jobs from the API based on categoryId
         const response = await fetchAllJobs(categoryId); // If categoryId is null, fetchAllJobs will fetch all jobs
         setJobs(response); // Store the fetched jobs in the state
 
         // Cache jobs and update the timestamp
         const now = Date.now();
         localStorage.setItem('jobs', JSON.stringify(response));
         localStorage.setItem('jobs_last_updated', now.toString());
       } catch (err) {
         setError('Failed to fetch jobs');
         console.error(err);
       } finally {
         setLoading(false); // Set loading to false once data is fetched
       }
     };
 
     // Only fetch if categoryId has changed or on first load
     getJobs();
 
   }, [categoryId]); // Re-run when categoryId changes
 
 
   if (loading) {
     return <div>Loading...</div>; // Show a loading state while the jobs are being fetched
   }
 
   if (error) {
     return <div>{error}</div>; // Show an error message if fetching fails
   }
 

  return (
    <Layout>

      <AllJobs jobs={jobs}/>


    </Layout>
  );
};

export default AllJobsPage;
