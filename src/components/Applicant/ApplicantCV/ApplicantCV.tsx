"use client";

import React from "react";
import CVTemplate1 from "./CVTemplates/CVTemplate1";

const staticApplicantData = {
  profile: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+255 712 345 678",
    address: "Dar es Salaam, Tanzania",
    summary: "Experienced software engineer with 5+ years in full-stack development."
  },
  educationalQualifications: [
    { degree: "BSc Computer Science", institution: "University of Dar es Salaam", year: "2018" }
  ],
  professionalQualifications: [
    { title: "AWS Certified Solutions Architect", year: "2021" }
  ],
  experiences: [
    { company: "Tech Solutions Ltd", role: "Software Engineer", duration: "2018-2021" },
    { company: "Misantechnology", role: "Senior Developer", duration: "2021-Present" }
  ],
  languages: ["English", "Swahili"],
  skills: ["ReactJS", "Node.js", "Laravel", "AWS"],
  referees: [
    { name: "Jane Smith", position: "Manager", contact: "+255 789 123 456" }
  ],
  socialMediaLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
    { platform: "GitHub", url: "https://github.com/johndoe" }
  ]
};

const ApplicantCV: React.FC = () => {
  return (
    <div>
      <h1>Sample Applicant CV</h1>
      <CVTemplate1 data={staticApplicantData} />
    </div>
  );
};

export default ApplicantCV;
