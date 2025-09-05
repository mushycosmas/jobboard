// WorkExperience.js
import React from 'react';
import styles from '../../../src/styles/cv/template1.module.css'; // Assuming you have a CSS module

const WorkExperience = ({ experiencesData }) => {
  // Ensure experiencesData is an array, defaulting to an empty array
  const experiences = experiencesData || [];

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Work Experience</h3>
      <ul>
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <li key={experience.id}>
              <h4>{experience.position} | {experience.institution}</h4>
              <p><strong>{experience.from} - {experience.to}</strong></p>
              <p>{experience.description}</p>
            </li>
          ))
        ) : (
          <p>No work experience available</p>
        )}
      </ul>
    </section>
  );
};

export default WorkExperience;
