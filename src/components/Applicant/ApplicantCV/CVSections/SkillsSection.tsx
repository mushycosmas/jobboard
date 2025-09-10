"use client";

import React from "react";

interface SkillsProps {
  skills: string[];
}

const SkillsSection: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <div className="skills-section mb-3">
      <h3>Skills</h3>
      <ul>
        {skills.map((skill, idx) => (
          <li key={idx}>{skill}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default SkillsSection;
