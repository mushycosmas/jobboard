import React from 'react';

const Skills = ({ skills }) => (
  <section className="section">
    <h3 className="section-title">Skills</h3>
    <div className="skills">
      {skills.map(skill => (
        <span key={skill.id} className="skill">{skill.skill_name}</span>
      ))}
    </div>
  </section>
);

export default Skills;
