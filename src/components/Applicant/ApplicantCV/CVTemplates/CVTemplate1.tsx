"use client";

import React from "react";
import PersonalProfile from "../CVSections/PersonalProfile";
import EducationSection from "../CVSections/EducationSection";
import ProfessionalQualification from "../CVSections/ProfessionalQualification";
import ExperienceSection from "../CVSections/ExperienceSection";
import LanguagesSection from "../CVSections/LanguagesSection";
import SkillsSection from "../CVSections/SkillsSection";
import RefereesSection from "../CVSections/RefereesSection";
import SocialMediaSection from "../CVSections/SocialMediaSection";

interface CVTemplateProps {
  data?: {
    profile?: Record<string, any>;
    education?: any[];
    professionalQualifications?: any[];
    experiences?: any[];
    languages?: any[];
    skills?: any[];
    referees?: any[];
    socialMediaLinks?: any[];
  };
}

const CVTemplate1: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div
      className="cv-template border p-4"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <PersonalProfile profile={data?.profile ?? {}} />
      <EducationSection educationalQualifications={data?.education ?? []} />
      <ProfessionalQualification
        professionalQualifications={data?.professionalQualifications ?? []}
      />
      <ExperienceSection experiences={data?.experiences ?? []} />
      <LanguagesSection languages={data?.languages ?? []} />
      <SkillsSection skills={data?.skills ?? []} />
      <RefereesSection referees={data?.referees ?? []} />
      <SocialMediaSection socialMediaLinks={data?.socialMediaLinks ?? []} />
    </div>
  );
};

export default CVTemplate1;

