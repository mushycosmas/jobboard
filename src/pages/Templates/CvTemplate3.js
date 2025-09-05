import React from 'react';
import styles from '../../../src/styles/cv/CvTemplate.module.css'; 
const CvTemplate3 = () => {
  return (
    <div className={styles.cvContainer}>
      {/* Header with Name and Title */}
      <header className={styles.cvHeader}>
        <div className={styles.cvHeaderContent}>
          <h1 className={styles.cvName}>John Doe</h1>
          <h3 className={styles.cvTitle}>Full Stack Developer</h3>
          <p className={styles.cvContact}>
            <span>Email: johndoe@email.com</span>
            <span>Phone: +1 (555) 123-4567</span>
            <span>Location: San Francisco, CA</span>
            <span>LinkedIn: linkedin.com/in/johndoe</span>
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={styles.cvBody}>
        {/* About Me Section */}
        <section className={styles.cvSection}>
          <h3 className={styles.sectionTitle}>About Me</h3>
          <p className={styles.sectionContent}>
            Passionate and skilled Full Stack Developer with over 5 years of experience
            in creating dynamic, responsive, and scalable web applications. Expertise in
            JavaScript, React, Node.js, and database management systems. Adept at working
            collaboratively in agile teams to build user-centric products.
          </p>
        </section>

        {/* Experience Section */}
        <section className={styles.cvSection}>
          <h3 className={styles.sectionTitle}>Work Experience</h3>
          <div className={styles.experienceItem}>
            <h4 className={styles.jobTitle}>Lead Full Stack Developer</h4>
            <p className={styles.companyName}>Tech Innovations | Jan 2020 - Present</p>
            <ul className={styles.jobDescription}>
              <li>Led a team of 6 developers to create scalable web applications.</li>
              <li>Developed applications using React.js, Node.js, and MongoDB.</li>
              <li>Optimized performance for large-scale applications with thousands of users.</li>
            </ul>
          </div>
          <div className={styles.experienceItem}>
            <h4 className={styles.jobTitle}>Software Engineer</h4>
            <p className={styles.companyName}>Web Solutions Ltd. | May 2015 - Dec 2019</p>
            <ul className={styles.jobDescription}>
              <li>Developed dynamic front-end interfaces using Angular and React.js.</li>
              <li>Worked with back-end APIs using Express.js and PostgreSQL.</li>
              <li>Collaborated with cross-functional teams to deliver software solutions.</li>
            </ul>
          </div>
        </section>

        {/* Education Section */}
        <section className={styles.cvSection}>
          <h3 className={styles.sectionTitle}>Education</h3>
          <div className={styles.educationItem}>
            <h4 className={styles.degree}>Bachelor of Science in Computer Science</h4>
            <p className={styles.universityName}>University of Technology | Graduated: 2014</p>
            <p>Focus on full-stack development, algorithms, and data structures.</p>
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.cvSection}>
          <h3 className={styles.sectionTitle}>Skills</h3>
          <div className={styles.skillsList}>
            <span className={styles.skill}>JavaScript</span>
            <span className={styles.skill}>React</span>
            <span className={styles.skill}>Node.js</span>
            <span className={styles.skill}>MongoDB</span>
            <span className={styles.skill}>Express.js</span>
            <span className={styles.skill}>HTML5</span>
            <span className={styles.skill}>CSS3</span>
            <span className={styles.skill}>Git</span>
            <span className={styles.skill}>Docker</span>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.cvFooter}>
          <p>&copy; 2024 John Doe</p>
        </footer>
      </div>
    </div>
  );
};

export default CvTemplate3;
