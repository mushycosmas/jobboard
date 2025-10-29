import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import JobList from '../../../components/Job/JobList';
import JobForm from '../../../components/Job/JobForm';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import PreviewModal from '../../Job/PreviewModal';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]); // All jobs fetched from API
  const [modalShow, setModalShow] = useState(false); // Show modal for creating or editing job
  const [modalView, setModalView] = useState(false); // Show modal for viewing job details
  const [selectedJob, setSelectedJob] = useState(null); // Selected job for preview
  const [editJobData, setEditJobData] = useState(null); // For editing a job
  const [jobStatus, setJobStatus] = useState('all'); // For job status filter (active, expired, all)
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [jobCounts, setJobCounts] = useState({ active: 0, expired: 0, all: 0 }); // Job counts for each status

  // Get the employer_id from localStorage (ensure this was saved at login)
  const employerId = localStorage.getItem('employerId');
  
  if (!employerId) {
    console.error('Employer ID is missing. Please log in again.');
    // Handle the case when employer_id is not found (redirect, etc.)
  }

  const location = useLocation(); // To access the query parameters from URL
  const navigate = useNavigate(); // To navigate and update URL query params

  // Fetch all job counts (active, expired, all) at once from the API, filtered by employer_id
  const fetchJobCounts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/jobs/counts/${employerId}`);
      const data = await response.json();
      setJobCounts(data); // Set the job counts for each status (active, expired, all)
    } catch (error) {
      console.error('Error fetching job counts:', error);
    }
  };

  // Fetch jobs from the API based on the selected status and employer_id
  const fetchJobs = async () => {
    try {
      setLoading(true); // Start loading
      const status = getStatusFromQuery();
      setJobStatus(status); // Update the status filter in the state

      // If employer_id is not available, we fetch all jobs
      const url = employerId
        ? `http://localhost:4000/api/jobs/get?status=${status}&employer_id=${employerId}`
        : `http://localhost:4000/api/jobs/get?status=${status}`; // Admin case

      const response = await fetch(url);
      const data = await response.json();
      setJobs(data); // Set the jobs data
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Function to get the current status from URL query params
  const getStatusFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('status') || 'all'; // Default to 'all' if no status param exists
  };

  // Call fetchJobs and fetchJobCounts when the component mounts or when the query params change
  useEffect(() => {
    if (!employerId) return; // Ensure employerId is available before making requests
    fetchJobCounts(); // Fetch job counts first
    fetchJobs(); // Then fetch jobs based on the selected status
  }, [location.search, employerId]); // Re-run if the URL query changes or employer_id changes

  // Handle job creation
  const handleCreateJob = () => {
    setEditJobData(null); // Reset the form for new job
    setModalShow(true);   // Show the modal
  };

  // Handle viewing a job
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setModalView(true); // Show the preview modal
    console.log(job);
  };

  const closeModal = () => {
    setModalView(false);
    setSelectedJob(null); // Clear the selected job
  };

  // Handle job editing
  const handleEditJob = (job) => {
    setEditJobData(job); // Set the form with job data for editing
    setModalShow(true);  // Show the modal
  };

  // Delete a job
  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/jobs/delete/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      return true; // Return true on success
    } catch (error) {
      console.error("Error deleting job:", error);
      return false; // Return false on failure
    }
  };

  // Handle save job (create or update)
  const handleSaveJob = async (jobData) => {
    try {
      let success;

      if (editJobData) {
        // Update job
        success = await updateJob({ ...editJobData, ...jobData });
        if (success) {
          setJobs(jobs.map(job => job.id === editJobData.id ? { ...job, ...jobData } : job));
        }
      } else {
        // Add new job
        success = await addJob(jobData);
        if (success) {
          setJobs([...jobs, jobData]);
        }
      }

      if (success) {
        setModalShow(false); // Close modal after success
      } else {
        console.error("Failed to save job.");
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  // Handle delete job from the list
  const handleDeleteJob = async (jobId) => {
    const success = await deleteJob(jobId);
    if (success) {
      setJobs(jobs.filter(job => job.id !== jobId)); // Remove deleted job from list
      console.log(`Job with id ${jobId} deleted successfully.`);
    } else {
      console.error(`Failed to delete job with id ${jobId}.`);
    }
  };

  // Handle status change and update URL query parameter
  const handleStatusChange = (status) => {
    setJobStatus(status); // Update the selected status

    // Update the URL to reflect the selected status
    navigate({
      pathname: '/admin/manage-jobs',
      search: `?status=${status}`,
    });
  };

  return (
    <AdminLayout>
      <div className="content">
        <h2>Manage Jobs</h2>

        <div className="d-flex align-items-center mb-3">
          <Button variant="primary" onClick={handleCreateJob} className="mr-3">
            Create Job
          </Button>

          {/* Dropdown for filtering jobs by status */}
          <Dropdown className='m-1'>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {jobStatus === 'all' ? 'All Jobs' : jobStatus === 'active' ? 'Active Jobs' : 'Expired Jobs'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusChange('all')}>All Jobs</Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange('active')}>Active Jobs</Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange('expired')}>Expired Jobs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <JobList jobs={jobs} onDelete={handleDeleteJob} onEdit={handleEditJob} onView={handleViewJob} />

        <Modal show={modalShow} onHide={() => setModalShow(false)} className='modal-lg'>
          <Modal.Header closeButton>
            <Modal.Title>{editJobData ? 'Edit Job' : 'Create Job'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JobForm onSubmit={handleSaveJob} initialData={editJobData} setModalShow={setModalShow} fetchJobs={fetchJobs} />
          </Modal.Body>
        </Modal>

        <PreviewModal show={modalView} handleClose={closeModal} job={selectedJob} />
      </div>
    </AdminLayout>
  );
};

export default JobManagement;
