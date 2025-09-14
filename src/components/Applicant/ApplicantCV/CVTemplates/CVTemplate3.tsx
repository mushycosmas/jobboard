"use client";

import React from "react";

interface CVTemplateProps {
  data: any;
}

const CVTemplate3: React.FC<CVTemplateProps> = ({ data }) => {
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
    <div
      className="cv-template-3 border p-4 rounded shadow-sm"
      style={{ display: "flex", gap: "2rem" }}
    >
      {/* Left Column */}
      <div style={{ flex: 1 }}>
        <h2>{profile.fullName ?? "No Name"}</h2>
        <p>
          {profile.email ?? "N/A"}<br />
          {profile.phone ?? "N/A"}<br />
          {profile.address ?? "N/A"}
        </p>
        <p className="fst-italic">{profile.summary ?? "No summary provided"}</p>

        <h5>Skills</h5>
        {skills.length ? (
          <ul>
            {skills.map((skill: string, idx: number) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills listed</p>
        )}

        <h5>Languages</h5>
        {languages.length ? (
          <ul>
            {languages.map((lang: string, idx: number) => (
              <li key={idx}>{lang}</li>
            ))}
          </ul>
        ) : (
          <p>No languages listed</p>
        )}

        <h5>Social Media</h5>
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

      {/* Right Column */}
      <div style={{ flex: 2 }}>
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
                {exp.position ?? "N/A"} at {exp.institution ?? "N/A"} ({exp.from ?? "N/A"} - {exp.to ?? (exp.is_currently_working ? "Present" : "N/A")})
              </li>
            ))}
          </ul>
        ) : (
          <p>No experience data</p>
        )}

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
      </div>
    </div>
  );
};

export default CVTemplate3;
