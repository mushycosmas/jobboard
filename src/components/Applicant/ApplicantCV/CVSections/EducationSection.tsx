"use client";

import React from "react";

interface EducationProps {
  educationalQualifications: { degree: string; institution: string; year: string }[];
}

const EducationSection: React.FC<EducationProps> = ({ educationalQualifications }) => {
  return (
    <div className="education-section mb-3">
      <h3>Education</h3>
      <ul>
        {educationalQualifications.map((edu, idx) => (
          <li key={idx}>
            <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default EducationSection;
