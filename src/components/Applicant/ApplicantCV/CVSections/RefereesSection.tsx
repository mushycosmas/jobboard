"use client";

import React from "react";

interface Referee {
  name: string;
  position: string;
  contact: string;
}

interface RefereesProps {
  referees: Referee[];
}

const RefereesSection: React.FC<RefereesProps> = ({ referees }) => {
  return (
    <div className="referees-section mb-3">
      <h3>Referees</h3>
      <ul>
        {referees.map((ref, idx) => (
          <li key={idx}>
            <strong>{ref.name}</strong> - {ref.position} | {ref.contact}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default RefereesSection;
