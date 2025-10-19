"use client";

import React from "react";

interface CVTemplateProps {
  data?: any;
}

const CVTemplate2: React.FC<CVTemplateProps> = ({ data }) => {
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
      {/* Header */}
      <h1 className="text-center mb-3">{profile.fullName ?? "No Name"}</h1>
      <p className="text-center">
        {profile.email ?? "N/A"} | {profile.phone ?? "N/A"} |{" "}
        {profile.address ?? "N/A"}
      </p>
      <p className="fst-italic">
        {profile.summary ?? "No summary provided"}
      </p>
      <hr />

      {/* Education */}
      <h4>Education</h4>
      {education.length ? (
        <ul>
          {education.map((edu: any, idx: number) => (
            <li key={idx}>
              {edu.degree ?? "N/A"} – {edu.institution_name ?? "N/A"} (
              {edu.started ?? "N/A"} – {edu.ended ?? "N/A"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No education data</p>
      )}

      {/* Professional Qualifications */}
      <h4>Professional Qualifications</h4>
      {professionalQualifications.length ? (
        <ul>
          {professionalQualifications.map((pq: any, idx: number) => (
            <li key={idx}>
              {pq.course ?? "N/A"} at {pq.institution_name ?? "N/A"} (
              {pq.started ?? "N/A"} – {pq.ended ?? "N/A"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No professional qualifications</p>
      )}

      {/* Experience */}
      <h4>Experience</h4>
      {experiences.length ? (
        <ul>
          {experiences.map((exp: any, idx: number) => (
            <li key={idx}>
              {exp.position ?? "N/A"} at {exp.institution ?? "N/A"} (
              {exp.from ?? "N/A"} –{" "}
              {exp.is_currently_working
                ? "Present"
                : exp.to ?? "N/A"}
              )
            </li>
          ))}
        </ul>
      ) : (
        <p>No experience data</p>
      )}

      {/* Skills */}
      <h4>Skills</h4>
      {skills.length ? (
        <p>{skills.map((s: any) => s.skill_name ?? "N/A").join(", ")}</p>
      ) : (
        <p>No skills listed</p>
      )}

      {/* Languages */}
      <h4>Languages</h4>
      {languages.length ? (
        <p>
          {languages
            .map(
              (l: any) =>
                `${l.language_name ?? "N/A"} (R:${l.read_level ?? "N/A"}, W:${
                  l.write_level ?? "N/A"
                }, S:${l.speak_level ?? "N/A"})`
            )
            .join("; ")}
        </p>
      ) : (
        <p>No languages listed</p>
      )}

      {/* Referees */}
      <h4>Referees</h4>
      {referees.length ? (
        <ul>
          {referees.map((ref: any, idx: number) => (
            <li key={idx}>
              {ref.name ?? "N/A"} – {ref.position ?? "N/A"} |{" "}
              {ref.contact ?? "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No referees listed</p>
      )}

      {/* Social Media */}
      <h4>Social Media</h4>
      {socialMediaLinks.length ? (
        <ul>
          {socialMediaLinks.map((link: any, idx: number) => (
            <li key={idx}>
              <a
                href={link.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
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

