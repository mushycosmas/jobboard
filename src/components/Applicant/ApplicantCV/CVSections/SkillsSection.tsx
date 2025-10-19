"use client";

import React from "react";

interface Skill {
  skill_name: string;
  level?: string;
}

interface SkillsProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsProps> = ({ skills = [] }) => {
  if (!skills.length) return <p>No skills listed</p>;

  return (
    <div className="skills-section mb-3">
      <h3>Skills</h3>
      <ul>
        {skills.map((skill, idx) => (
          <li key={idx}>
            <strong>{skill.skill_name ?? "N/A"}</strong>
            {skill.level ? ` (${skill.level})` : ""}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default SkillsSection;
