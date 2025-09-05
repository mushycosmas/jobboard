import React from 'react';
import { Link } from 'react-router-dom';

const JobItem = ({ job, onDelete, onEdit }) => {
  return (
    <tr>
    <td>{job.title}</td>
    <td>{new Date(job.posting_date).toLocaleDateString()}</td>
    <td>{new Date(job.expired_date).toLocaleDateString()}</td>
    <td>
    {job.total_applicants > 0 ? (
     <Link to={`/employer/jobs/${job.id}/applicants`} className="text-decoration-none">
      {job.total_applicants}
      </Link>
      ) : (
    job.total_applicants
        )}
    </td>

    <td>
      <div className="dropdown">
        <button
          className="btn btn-sm btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actions
        </button>
        <ul className="dropdown-menu">
          {job.total_applicants > 0 ? (
            <li>
              <Link className="dropdown-item" to={`/employer/jobs/${job.id}/applicants`}>
                View Applicants
              </Link>
            </li>
          ) : (
            <li>
              <button className="dropdown-item disabled">No Applicants</button>
            </li>
          )}
          <li>
            <button className="dropdown-item" onClick={() => onEdit(job)}>
              Edit
            </button>
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={() => onDelete(job.id)}>
              Delete
            </button>
          </li>
        </ul>
      </div>
    </td>
  </tr>
  
  );
};

export default JobItem;
