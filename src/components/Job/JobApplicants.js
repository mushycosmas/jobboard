import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';  // Import necessary components from React-Bootstrap

const stages = [
  { id: 1, name: 'Applied' },
  { id: 3, name: 'Assessment' },
  { id: 4, name: 'Interview' },
  { id: 2, name: 'Screening' },
  { id: 5, name: 'Offer' },
  { id: 6, name: 'Hired' },
  { id: 7, name: 'Rejected' }
];

const JobApplicants = ({ handleRowClick }) => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [selectedStages, setSelectedStages] = useState({});
  const [showIframe, setShowIframe] = useState(false); // Track iframe visibility
  const [iframeUrl, setIframeUrl] = useState(''); // URL for iframe
  
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/jobs/job-applicants/${jobId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setJobTitle(data.jobTitle);
        setApplicants(data.applicants);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStageChange = (applicantId, stageId) => {
    setSelectedStages(prev => ({ ...prev, [applicantId]: stageId }));
  };

  const updateStage = async (applicantId) => {
    const stage_id = selectedStages[applicantId];
    if (!stage_id) return alert("Please select a stage.");

    try {
      const response = await fetch(`http://localhost:4000/api/employers/recruitment-stage/${applicantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stage_id })
      });

      if (!response.ok) throw new Error('Stage update failed');

      alert('Stage updated successfully!');
      // Optionally, you can refetch applicants to refresh UI
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  // Function to toggle iframe modal visibility
  const showJobDetails = (url) => {
    setIframeUrl(url);  // Set the iframe URL
    setShowIframe(true);  // Show modal
  };

  const closeModal = () => {
    setShowIframe(false);  // Close modal
    setIframeUrl('');  // Reset iframe URL
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Applicants for: <strong>{jobTitle}</strong></h2>

      {applicants.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Applicant Name</th>
                <th>Applied On</th>
                <th>Current Status</th>
                <th>Change Stage</th>
                <th>View Job</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => (
                <tr
                  key={applicant.id}
                  onClick={() => handleRowClick(applicant.applicant_id, applicant.id)} // Open modal on row click
                  style={{ cursor: 'pointer' }}
                >
                  <td>{index + 1}</td>
                  <td>{applicant.first_name} {applicant.last_name}</td>
                  <td>{new Date(applicant.created_at).toLocaleDateString()}</td>
                  <td>{applicant.status || 'Pending'}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select"
                        value={selectedStages[applicant.id] || ''}
                        onChange={(e) => handleStageChange(applicant.id, parseInt(e.target.value))}
                      >
                        <option value="">Select stage</option>
                        {stages.map(stage => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                      <button className="btn btn-primary btn-sm" onClick={() => updateStage(applicant.id)}>
                        Update
                      </button>
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => showJobDetails(`https://ekazi.co.tz/job/show/sales-executive-2-job-in-dar-es-salaam-Tanzania/MTEwNjc=`)} // Use applicant slug or job URL
                    >
                      View Job
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No applicants found for this job.</p>
      )}

      {/* Modal for full-screen iframe */}
      <Modal
        show={showIframe}
        onHide={closeModal}
        size="md"
        fullscreen={true}  // Fullscreen modal
      >
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={iframeUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 'none', height: '100vh' }}  // Take full height
            title="Job Listing"
          >
            Your browser does not support iframes.
          </iframe>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default JobApplicants;
