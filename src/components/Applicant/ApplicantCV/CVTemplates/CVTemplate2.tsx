"use client";

import React from "react";

interface CVTemplateProps {
  data: any;
}

const CVTemplate2: React.FC<CVTemplateProps> = ({ data }) => {
  // Provide default empty objects/arrays for safety
  const {
    profile = {},
    education = [],
    professionalQualifications = [],
    experiences = [],
    languages = [],
    skills = [],
    referees = [],
    socialMediaLinks = [],
  } = data || {};

  return (
    <div className="cv-template-2 border p-4 bg-light rounded shadow-sm">
      <h1 className="text-center mb-3">{profile.fullName ?? "No Name"}</h1>
      <p className="text-center">
        {profile.email ?? "N/A"} | {profile.phone ?? "N/A"} | {profile.address ?? "N/A"}
      </p>
      <p className="fst-italic">{profile.summary ?? "No summary provided"}</p>
      <hr />

      <h4>Education</h4>
      {education.length ? (
        <ul>
          {education.map((edu: any, idx: number) => (
            <li key={idx}>
              {edu.degree ?? "N/A"} - {edu.institution ?? "N/A"} ({edu.started ?? "N/A"} - {edu.ended ?? "N/A"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No education data</p>
      )}

      <h4>Professional Qualifications</h4>
      {professionalQualifications.length ? (
        <ul>
          {professionalQualifications.map((pq: any, idx: number) => (
            <li key={idx}>
              {pq.course ?? "N/A"} at {pq.institution ?? "N/A"} ({pq.started ?? "N/A"} - {pq.ended ?? "N/A"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No professional qualifications</p>
      )}

      <h4>Experience</h4>
      {experiences.length ? (
        <ul>
          {experiences.map((exp: any, idx: number) => (
            <li key={idx}>
              {exp.position ?? "N/A"} at {exp.institution ?? "N/A"} ({exp.from ?? "N/A"} - {exp.to ?? exp.is_currently_working ? "Present" : "N/A"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No experience data</p>
      )}

      <h4>Skills</h4>
      <p>{skills.length ? skills.join(", ") : "No skills listed"}</p>

      <h4>Languages</h4>
      <p>{languages.length ? languages.map((l: any) => l.name ?? "N/A").join(", ") : "No languages listed"}</p>

      <h4>Referees</h4>
      {referees.length ? (
        <ul>
          {referees.map((ref: any, idx: number) => (
            <li key={idx}>
              {ref.name ?? "N/A"} - {ref.position ?? "N/A"} | {ref.contact ?? "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No referees listed</p>
      )}

      <h4>Social Media</h4>
      {socialMediaLinks.length ? (
        <ul>
          {socialMediaLinks.map((link: any, idx: number) => (
            <li key={idx}>
              <a href={link.url ?? "#"} target="_blank" rel="noopener noreferrer">
                {link.platform ?? "N/A"}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No social media links</p>
      )}
    </div>
  );
};

export default CVTemplate2;
