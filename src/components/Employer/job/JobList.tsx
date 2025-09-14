
"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  [key: string]: any; // For any additional job properties
};

type JobListProps = {
  jobs: Job[];
  onView?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onSelect?: (job: Job) => void;
};

const JobList: React.FC<JobListProps> = ({ jobs, onView, onEdit, onDelete, onSelect }) => {
  return (
    <div>
      <h2>Job List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Company</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.description}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td className="d-flex gap-1 flex-wrap">
                {onView && <Button variant="info" onClick={() => onView(job)}>View</Button>}
                {onEdit && <Button variant="warning" onClick={() => onEdit(job)}>Edit</Button>}
                {onDelete && <Button variant="danger" onClick={() => onDelete(job)}>Delete</Button>}
                {onSelect && <Button variant="primary" onClick={() => onSelect(job)}>Select</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default JobList;
