"use client";

import React from "react";
import DOMPurify from "dompurify";

interface Experience {
  institution_name?: string | null;
  position_name?: string;
  from_date?: string | null;
  to_date?: string | null;
  responsibility?: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const formatDuration = (from?: string | null, to?: string | null) => {
    if (!from) return "";
    return `${from} - ${to ?? "Present"}`;
  };

  return (
    <div className="experience-section mb-3">
      <h3>Work Experience</h3>
      <ul>
        {experiences.map((exp, idx) => (
          <li key={idx} style={{ marginBottom: "1rem" }}>
            <strong>{exp.position_name || "N/A"}</strong> at {exp.institution_name || "N/A"} (
            {formatDuration(exp.from_date, exp.to_date)})
            {exp.responsibility && (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(exp.responsibility),
                }}
              />
            )}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default ExperienceSection;
