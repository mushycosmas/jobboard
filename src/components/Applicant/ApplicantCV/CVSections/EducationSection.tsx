"use client";

import React from "react";

interface Education {
  education_level?: string;
  programme_name?: string;
  institution_name?: string;
  started?: string;
  ended?: string;
}

interface EducationSectionProps {
  educationalQualifications: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ educationalQualifications }) => {
  const formatYear = (start?: string, end?: string) => {
    if (!start) return "";
    const fromYear = new Date(start).getFullYear();
    const toYear = end ? new Date(end).getFullYear() : "Present";
    return `${fromYear} - ${toYear}`;
  };

  return (
    <div className="education-section mb-3">
      <h3>Education</h3>
      <ul>
        {educationalQualifications.map((edu, idx) => (
          <li key={idx}>
            <strong>{`${edu.education_level ?? ""} ${edu.programme_name ?? ""}`.trim()}</strong>{" "}
            - {edu.institution_name ?? "N/A"} ({formatYear(edu.started, edu.ended)})
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default EducationSection;
