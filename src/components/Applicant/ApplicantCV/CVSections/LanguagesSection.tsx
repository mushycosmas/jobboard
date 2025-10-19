"use client";

import React from "react";

interface Language {
  language_name: string;
  read_level?: string;
  write_level?: string;
  speak_level?: string;
}

interface LanguagesProps {
  languages: Language[];
}

const LanguagesSection: React.FC<LanguagesProps> = ({ languages = [] }) => {
  if (!languages.length) return <p>No languages listed</p>;

  return (
    <div className="languages-section mb-3">
      <h3>Languages</h3>
      <ul>
        {languages.map((lang, idx) => (
          <li key={idx}>
            <strong>{lang.language_name ?? "N/A"}</strong>{" "}
            (Read: {lang.read_level ?? "N/A"}, 
            Write: {lang.write_level ?? "N/A"}, 
            Speak: {lang.speak_level ?? "N/A"})
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default LanguagesSection;
