"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";
import { JobApplicationData } from "./JobApplicationsComponent";

interface Props {
  applications: JobApplicationData[];
  onEdit: (application: JobApplicationData & { id: number }) => void;
  onDelete: (id: number) => void;
}

const JobApplicationsTable: React.FC<Props> = ({ applications, onEdit, onDelete }) => {
  if (!applications.length) {
    return <p className="text-muted">No job applications found.</p>;
  }

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="table-success">
        <tr>
          <th>Job Title</th>
          <th>Application Letter</th>
          <th>Status</th>
          <th>Applied Date</th>
          <th>Posting Date</th>
          <th>Expired Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app.id}>
            <td>{app.job_title || "N/A"}</td>
            <td dangerouslySetInnerHTML={{ __html: app.letter || "" }}></td>
            <td>{app.status || "Pending"}</td>
            <td>{new Date(app.created_at).toLocaleDateString()}</td>
            <td>{app.posting_date ? new Date(app.posting_date).toLocaleDateString() : "N/A"}</td>
            <td>{app.expired_date ? new Date(app.expired_date).toLocaleDateString() : "N/A"}</td>
            <td>
              {/* <Button
                size="sm"
                variant="primary"
                className="me-2"
                onClick={() => onEdit(app as JobApplicationData & { id: number })}
              >
                Edit
              </Button> */}
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(app.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default JobApplicationsTable;
