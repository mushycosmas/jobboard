// AdminDashboard.js
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import JobList from '../../components/Job/JobList';
import JobForm from '../../components/Job/JobForm';
import useJobs from '../../hooks/useJobs';

const AdminDashboard = () => {
  const { addJob } = useJobs();

  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      {/* <JobForm onSubmit={addJob} />
      <JobList /> */}
    </AdminLayout>
  );
};

export default AdminDashboard;
