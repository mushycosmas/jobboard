import React from 'react';
import JobItem from './JobItem';

const JobList = ({ jobs, onDelete, onEdit,onView }) => {
  return (
    <div>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Title</th>
            {/* <th>Description</th> */}
            <th>Inserted on</th>
            <th>Expired on</th>
            <th>Application</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <JobItem key={job.id} job={job} onDelete={onDelete} onEdit={onEdit}  onView={onView} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;
