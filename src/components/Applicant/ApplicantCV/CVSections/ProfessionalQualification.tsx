"use client";

import React from "react";

interface ProfessionalQualificationItem {
  institution_name?: string;
  started?: string;
  ended?: string;
}

interface ProfessionalQualificationProps {
  professionalQualifications: ProfessionalQualificationItem[];
}

const ProfessionalQualification: React.FC<ProfessionalQualificationProps> = ({ professionalQualifications }) => {
  const formatYear = (start?: string, end?: string) => {
    if (!start) return "";
    const fromYear = new Date(start).getFullYear();
    const toYear = end ? new Date(end).getFullYear() : "Present";
    return `${fromYear} - ${toYear}`;
  };

  return (
    <div className="professional-qualification mb-3">
      <h3>Professional Qualifications</h3>
      <ul>
        {professionalQualifications.map((pq, idx) => (
          <li key={idx}>
            {pq.institution_name ?? "N/A"} ({formatYear(pq.started, pq.ended)})
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default ProfessionalQualification;
