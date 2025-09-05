import React from 'react';

const Certifications = ({ qualifications }) => (
  <section className="section">
    <h3 className="section-title">Certifications</h3>
    <ul>
      {qualifications.map(qualification => (
        <li key={qualification.id}>
          <h4>{qualification.course}</h4>
          <p><strong>{qualification.institution}</strong> | {qualification.ended}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default Certifications;
