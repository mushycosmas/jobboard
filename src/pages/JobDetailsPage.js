// src/pages/JobDetailsPage.js
import React from 'react';

const JobDetailsPage = ({ job }) => (
  <div>
    <h1>{job.title}</h1>
    <p>Company: {job.company}</p>
    <p>Location: {job.location}</p>
    <p>Description: {job.description}</p>
    <button>Apply</button>
  </div>
);

export default JobDetailsPage;
