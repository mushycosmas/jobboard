"use client";

import React from "react";

interface LanguagesProps {
  languages: string[];
}

const LanguagesSection: React.FC<LanguagesProps> = ({ languages }) => {
  return (
    <div className="languages-section mb-3">
      <h3>Languages</h3>
      <ul>
        {languages.map((lang, idx) => (
          <li key={idx}>{lang}</li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default LanguagesSection;
