"use client";

import React from "react";

interface ExperienceProps {
  experiences: { company: string; role: string; duration: string }[];
}

const ExperienceSection: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <div className="experience-section mb-3">
      <h3>Work Experience</h3>
      <ul>
        {experiences.map((exp, idx) => (
          <li key={idx}>
            <strong>{exp.role}</strong> at {exp.company} ({exp.duration})
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default ExperienceSection;
