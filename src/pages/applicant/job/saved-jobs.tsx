"use client";

import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
import SavedJobsComponent from "@/components/Applicant/Applications/job/SavedJobsComponent";

export default function Applications() {
  return (
    <ApplicantLayout>
      <SavedJobsComponent/>
    </ApplicantLayout>
  );
}


