import React from 'react';
import JobItem from './JobItem';

interface Job {
  id: number;
  title: string;
  posting_date?: string;
  expired_date?: string;
  total_applicants?: number;
  [key: string]: any; // include other dynamic fields
}

interface JobListProps {
  jobs?: Job[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs = [], onDelete, onEdit, onView }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Title</th>
            <th>Inserted On</th>
            <th>Expired On</th>
            <th>Applications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
                onDelete={onDelete}
                onEdit={onEdit}
                onView={onView}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-muted">
                No jobs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;
