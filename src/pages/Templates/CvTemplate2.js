import React from 'react';
import styles from '../../../src/styles/cv/template.module.css';  // Import the scoped CSS Module

const CvTemplate2 = () => {
  return (
    <div className={styles.cvContainer}>
      <div className={styles.sidebar}>
        <div className="profile">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className={styles.profileImg}  // Use the scoped class name
          />
          <h2 className={styles.profileName}>Jane Smith</h2>
          <p className={styles.profileTitle}>Senior Software Engineer</p>
          <div className={styles.profileContact}>
            <p>Email: jane.smith@email.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className={styles.links}>
          <p>LinkedIn: linkedin.com/in/janesmith</p>
          <p>GitHub: github.com/janesmith</p>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* About Me Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>About Me</h3>
          <p>
            Enthusiastic Senior Software Engineer with 10+ years of experience in developing scalable and maintainable web applications. Passionate about clean code and cutting-edge technologies.
          </p>
        </section>

        {/* Work Experience Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Work Experience</h3>
          <ul>
            <li>
              <h4>Lead Full Stack Developer | Tech Innovations</h4>
              <p><strong>January 2020 - Present</strong></p>
              <p>Designed and built scalable web applications using React.js, Node.js, and MongoDB. Led a team of engineers, ensuring high-quality deliverables while meeting project deadlines.</p>
            </li>
            <li>
              <h4>Software Engineer | Web Solutions Ltd.</h4>
              <p><strong>May 2015 - December 2019</strong></p>
              <p>Developed dynamic web applications using AngularJS, Express, and MySQL. Worked closely with clients to implement user-friendly interfaces and improve website performance.</p>
            </li>
          </ul>
        </section>

        {/* Education Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Education</h3>
          <ul>
            <li>
              <h4>Bachelor of Science in Computer Science</h4>
              <p><strong>University of Technology</strong> | Graduated in 2014</p>
              <p>Graduated with honors and specialized in full-stack web development and software engineering principles.</p>
            </li>
          </ul>
        </section>

        {/* Skills Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Skills</h3>
          <div className={styles.skills}>
            <span className={styles.skill}>JavaScript</span>
            <span className={styles.skill}>React</span>
            <span className={styles.skill}>Node.js</span>
            <span className={styles.skill}>MongoDB</span>
            <span className={styles.skill}>Angular</span>
            <span className={styles.skill}>Express.js</span>
            <span className={styles.skill}>Docker</span>
            <span className={styles.skill}>Git</span>
          </div>
        </section>

        {/* Certifications Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Certifications</h3>
          <ul>
            <li>
              <h4>Certified JavaScript Developer</h4>
              <p><strong>Code Academy</strong> | 2018</p>
            </li>
            <li>
              <h4>AWS Certified Developer</h4>
              <p><strong>Amazon Web Services</strong> | 2020</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CvTemplate2;
