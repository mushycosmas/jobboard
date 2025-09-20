"use client";

import React from "react";
import { useSession } from "next-auth/react";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import GetAllApplicant from "../../../components/Applicant/GetAllApplicant";

const ResumeAllApplicants: React.FC = () => {
  const { data: session, status } = useSession();

  // Extract employerId from session (make sure your session.user contains it)
  const employerId = session?.user?.employerId;

  if (status === "loading") {
    return <p className="text-center mt-4">Loading session...</p>;
  }

  if (!employerId) {
    return <p className="text-center mt-4 text-danger">Employer ID not found in session</p>;
  }

  return (
    <EmployerLayout>
      <GetAllApplicant employerId={employerId} />
    </EmployerLayout>
  );
};

export default ResumeAllApplicants;
