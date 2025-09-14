"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Modal } from "react-bootstrap";

const stages = [
  { id: 1, name: "Applied" },
  { id: 3, name: "Assessment" },
  { id: 4, name: "Interview" },
  { id: 2, name: "Screening" },
  { id: 5, name: "Offer" },
  { id: 6, name: "Hired" },
  { id: 7, name: "Rejected" },
];

interface Applicant {
  id: number;
  applicant_id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  status?: string;
}

interface JobApplicantsProps {
  handleRowClick: (applicantId: number, jobApplicantId: number) => void;
}

const JobApplicants: React.FC<JobApplicantsProps> = ({ handleRowClick }) => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId"); // Get jobId from URL query

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [selectedStages, setSelectedStages] = useState<Record<number, number>>({});
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        const response = await fetch(`/api/jobs/job-applicants/${jobId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setJobTitle(data.jobTitle);
        setApplicants(data.applicants);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStageChange = (applicantId: number, stageId: number) => {
    setSelectedStages((prev) => ({ ...prev, [applicantId]: stageId }));
  };

  const updateStage = async (applicantId: number) => {
    const stage_id = selectedStages[applicantId];
    if (!stage_id) return alert("Please select a stage.");

    try {
      const response = await fetch(`/api/employers/recruitment-stage/${applicantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_id }),
      });

      if (!response.ok) throw new Error("Stage update failed");
      alert("Stage updated successfully!");
      // Optionally, refetch applicants here to refresh UI
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };

  const showJobDetails = (url: string) => {
    setIframeUrl(url);
    setShowIframe(true);
  };

  const closeModal = () => {
    setShowIframe(false);
    setIframeUrl("");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        Applicants for: <strong>{jobTitle}</strong>
      </h2>

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
                  onClick={() => handleRowClick(applicant.applicant_id, applicant.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>
                    {applicant.first_name} {applicant.last_name}
                  </td>
                  <td>{new Date(applicant.created_at).toLocaleDateString()}</td>
                  <td>{applicant.status || "Pending"}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select"
                        value={selectedStages[applicant.id] || ""}
                        onChange={(e) =>
                          handleStageChange(applicant.id, parseInt(e.target.value))
                        }
                      >
                        <option value="">Select stage</option>
                        {stages.map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          updateStage(applicant.id);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        showJobDetails(
                          `https://ekazi.co.tz/job/show/sales-executive-2-job-in-dar-es-salaam-Tanzania/MTEwNjc=`
                        );
                      }}
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

      {/* Modal for iframe */}
      <Modal show={showIframe} onHide={closeModal} size="md" fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={iframeUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: "none", height: "100vh" }}
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
