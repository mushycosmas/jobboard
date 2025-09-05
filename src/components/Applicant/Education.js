import React from 'react';

const Education = ({ qualifications }) => (
  <section className="section">
    <h3 className="section-title">Education</h3>
    <ul>
      {qualifications.map(qualification => (
        <li key={qualification.id}>
          <h4>{qualification.degree}</h4>
          <p><strong>{qualification.institution}</strong> | Graduated in {qualification.ended}</p>
          <p>{qualification.description}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default Education;
