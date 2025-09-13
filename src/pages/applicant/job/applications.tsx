"use client";

import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
import JobApplicationsComponent from "@/components/Applicant/Applications/JobApplicationsComponent";

export default function Applications() {
  return (
    <ApplicantLayout>
      <JobApplicationsComponent/>
    </ApplicantLayout>
  );
}
