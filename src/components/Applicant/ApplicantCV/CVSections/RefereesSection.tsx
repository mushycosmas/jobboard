"use client";

import React from "react";

interface RefereeItem {
  first_name: string;
  last_name: string;
  referee_position: string;
  email: string;
  phone: string;
}

interface RefereesProps {
  referees: RefereeItem[];
}

const RefereesSection: React.FC<RefereesProps> = ({ referees }) => {
  return (
    <div className="referees-section mb-3">
      <h3>Referees</h3>
      <ul>
        {referees.map((ref, idx) => (
          <li key={idx}>
            <strong>{`${ref.first_name} ${ref.last_name}`}</strong> - {ref.referee_position} | {ref.email} | {ref.phone}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default RefereesSection;
