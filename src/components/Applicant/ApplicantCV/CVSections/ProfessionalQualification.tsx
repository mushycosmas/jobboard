"use client";

import React from "react";

interface ProfessionalQualificationProps {
  professionalQualifications: { title: string; year: string }[];
}

const ProfessionalQualification: React.FC<ProfessionalQualificationProps> = ({ professionalQualifications }) => {
  return (
    <div className="professional-qualification mb-3">
      <h3>Professional Qualifications</h3>
      <ul>
        {professionalQualifications.map((pq, idx) => (
          <li key={idx}>
            {pq.title} ({pq.year})
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default ProfessionalQualification;
