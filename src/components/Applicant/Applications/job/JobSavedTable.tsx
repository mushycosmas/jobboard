"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";
import { SavedJobData } from "./SavedJobsComponent";
import Link from "next/link";

interface Props {
  jobs: SavedJobData[];
  onDelete: (id: number) => void;
  formatDate: (dateStr: string) => string;
}

const JobSavedTable: React.FC<Props> = ({ jobs, onDelete, formatDate }) => {
  return (
    <Table striped bordered hover responsive>
      <thead className="table-success">
        <tr>
          <th>Job Title</th>
          <th>Posting Date</th>
          <th>Expired Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id}>
            <td>{job.job_title}</td> {/* Corrected field */}
            <td>{formatDate(job.posting_date)}</td>
            <td>{formatDate(job.expired_date)}</td>
            <td>
              <Button
                variant="danger"
                size="sm"
                className="me-2"
                onClick={() => onDelete(job.id)}
              >
                Delete
              </Button>
              <Link href={`/job/${job.slug}`} className="btn btn-primary btn-sm">
                View Job
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default JobSavedTable;
