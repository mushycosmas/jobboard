"use client";

import React from "react";

interface PersonalProfileProps {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    summary?: string;
  };
}

const PersonalProfile: React.FC<PersonalProfileProps> = ({ profile }) => {
  return (
    <div className="personal-profile mb-3">
      <h2>{profile.fullName}</h2>
      <p>{profile.email} | {profile.phone}</p>
      {profile.address && <p>{profile.address}</p>}
      {profile.summary && <p>{profile.summary}</p>}
      <hr />
    </div>
  );
};

export default PersonalProfile;
