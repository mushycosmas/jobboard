"use client";

import React from "react";
import Link from "next/link";
import { Dropdown, ButtonGroup } from "react-bootstrap";

interface JobItemProps {
  job: any;
  onDelete: (id: number) => void;
  onEdit: (job: any) => void;
}

const JobItem: React.FC<JobItemProps> = ({ job, onDelete, onEdit }) => {
  const formatDate = (date: string | null) => (date ? new Date(date).toLocaleDateString() : "-");

  return (
    <tr>
      <td>{job.title}</td>
      <td>{formatDate(job.posting_date)}</td>
      <td>{formatDate(job.expired_date)}</td>
      <td>
        {job.total_applicants > 0 ? (
          <Link href={`/employer/jobs/${job.id}/applicants`} className="text-decoration-none">
            {job.total_applicants}
          </Link>
        ) : (
          job.total_applicants
        )}
      </td>
      <td>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="secondary" size="sm">
            Actions
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {job.total_applicants > 0 ? (
              <Dropdown.Item as={Link} href={`/employer/jobs/${job.id}/applicants`}>
                View Applicants
              </Dropdown.Item>
            ) : (
              <Dropdown.Item disabled>No Applicants</Dropdown.Item>
            )}
            <Dropdown.Item onClick={() => onEdit(job)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(job.id)} className="text-danger">
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default JobItem;
