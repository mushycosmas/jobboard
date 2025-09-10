"use client";

import React from "react";

interface CVTemplateProps {
  data: any;
}

const CVTemplate3: React.FC<CVTemplateProps> = ({ data }) => {
  const { profile, educationalQualifications, professionalQualifications, experiences, languages, skills, referees, socialMediaLinks } = data;

  return (
    <div className="cv-template-3 border p-4 rounded shadow-sm" style={{ display: "flex", gap: "2rem" }}>
      {/* Left Column */}
      <div style={{ flex: 1 }}>
        <h2>{profile.fullName}</h2>
        <p>{profile.email}<br />{profile.phone}<br />{profile.address}</p>
        <p className="fst-italic">{profile.summary}</p>

        <h5>Skills</h5>
        <ul>
          {skills.map((skill: string, idx: number) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>

        <h5>Languages</h5>
        <ul>
          {languages.map((lang: string, idx: number) => (
            <li key={idx}>{lang}</li>
          ))}
        </ul>

        <h5>Social Media</h5>
        <ul>
          {socialMediaLinks.map((link: any, idx: number) => (
            <li key={idx}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.platform}</a></li>
          ))}
        </ul>
      </div>

      {/* Right Column */}
      <div style={{ flex: 2 }}>
        <h4>Education</h4>
        <ul>
          {educationalQualifications.map((edu: any, idx: number) => (
            <li key={idx}>{edu.degree} - {edu.institution} ({edu.year})</li>
          ))}
        </ul>

        <h4>Professional Qualifications</h4>
        <ul>
          {professionalQualifications.map((pq: any, idx: number) => (
            <li key={idx}>{pq.title} ({pq.year})</li>
          ))}
        </ul>

        <h4>Experience</h4>
        <ul>
          {experiences.map((exp: any, idx: number) => (
            <li key={idx}>{exp.role} at {exp.company} ({exp.duration})</li>
          ))}
        </ul>

        <h4>Referees</h4>
        <ul>
          {referees.map((ref: any, idx: number) => (
            <li key={idx}>{ref.name} - {ref.position} | {ref.contact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CVTemplate3;
