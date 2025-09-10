"use client";

import React from "react";

interface CVTemplateProps {
  data: any;
}

const CVTemplate2: React.FC<CVTemplateProps> = ({ data }) => {
  const { profile, educationalQualifications, professionalQualifications, experiences, languages, skills, referees, socialMediaLinks } = data;

  return (
    <div className="cv-template-2 border p-4 bg-light rounded shadow-sm">
      <h1 className="text-center mb-3">{profile.fullName}</h1>
      <p className="text-center">{profile.email} | {profile.phone} | {profile.address}</p>
      <p className="fst-italic">{profile.summary}</p>
      <hr />

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

      <h4>Skills</h4>
      <p>{skills.join(", ")}</p>

      <h4>Languages</h4>
      <p>{languages.join(", ")}</p>

      <h4>Referees</h4>
      <ul>
        {referees.map((ref: any, idx: number) => (
          <li key={idx}>{ref.name} - {ref.position} | {ref.contact}</li>
        ))}
      </ul>

      <h4>Social Media</h4>
      <ul>
        {socialMediaLinks.map((link: any, idx: number) => (
          <li key={idx}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.platform}</a></li>
        ))}
      </ul>
    </div>
  );
};

export default CVTemplate2;
