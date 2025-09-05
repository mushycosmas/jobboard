import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from '../../../src/styles/cv/template1.module.css'; // Ensure this path is correct

const Template1 = ({ 
  profile, 
  educationalQualifications, 
  professionalQualifications, 
  experiences, 
  languages, 
  skills, 
  referees, 
  socialMediaLinks // Added socialMediaLinks prop
}) => {
  const cvRef = useRef();

  const generatePdf = async () => {
    const canvas = await html2canvas(cvRef.current);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    pdf.addImage(data, 'PNG', 0, 0);
    pdf.save('CV.pdf');
  };

  return (
    <div>
      <div ref={cvRef} className={styles.cvContainer}>
        <div className={styles.sidebar}>
          <div className="profile">
            <img
              src={profile.profileImage}
              alt="Profile"
              className={styles.profileImg}
            />
            <h2 className={styles.profileName}>{profile.name}</h2>
            <p className={styles.profileTitle}>Senior Software Engineer</p>
            <div className={styles.profileContact}>
              <p>Email: {profile.email}</p>
              <p>Phone: {profile.phone}</p>
            </div>
          </div>
          <div className={styles.links}>
            {/* Dynamically render social media links */}
            {socialMediaLinks.map((link) => (
              <p key={link.id}>
                 <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
              </p>
            ))}
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* About Me Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>About Me</h3>
            <p>{profile.about}</p>
          </section>

          {/* Work Experience Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Work Experience</h3>
            <ul>
              {experiences.map((experience) => (
                <li key={experience.id}>
                  <h4>{experience.position} | {experience.institution}</h4>
                  <p><strong>{experience.from} - {experience.to}</strong></p>
                  <p>{experience.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Education Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Education</h3>
            <ul>
              {educationalQualifications.map((qualification) => (
                <li key={qualification.id}>
                  <h4>{qualification.degree}</h4>
                  <p><strong>{qualification.institution}</strong> | Graduated in {qualification.ended}</p>
                  <p>{qualification.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Skills</h3>
            <div className={styles.skills}>
              {skills.map((skill) => (
                <span key={skill.id} className={styles.skill}>{skill.skill_name}</span>
              ))}
            </div>
          </section>

          {/* Certifications Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Certifications</h3>
            <ul>
              {professionalQualifications.map((qualification) => (
                <li key={qualification.id}>
                  <h4>{qualification.course}</h4>
                  <p><strong>{qualification.institution}</strong> | {qualification.ended}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Button to generate PDF */}
      <button onClick={generatePdf} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Download PDF
      </button>
    </div>
  );
};

export default Template1;
