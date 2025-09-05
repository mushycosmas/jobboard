import React from 'react';
import { Table, Button } from 'react-bootstrap';

const JobList = ({ jobs, onView, onEdit, onDelete, onSelect }) => {
  return (
    <div>
      <h2>Job List</h2>
      <Table striped bordered hover>
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
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.description}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>
                <Button variant="info" onClick={() => onView(job.id)}>View</Button>{' '}
                <Button variant="warning" onClick={() => onEdit(job.id)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => onDelete(job.id)}>Delete</Button>{' '}
                <Button variant="primary" onClick={() => onSelect(job.id)}>Select</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default JobList;
