"use client";

import React from "react";
import { useSession } from "next-auth/react";
import AdminLayout from "../../../layouts/AdminLayout";
import AdminAllApplicant from "../../../components/Applicant/AdminAllApplicant";

const ResumeAllApplicants: React.FC = () => {
  const { data: session, status } = useSession();

  // Extract employerId from session (make sure your session.user contains it)
  const id = session?.user?.id;

  if (status === "loading") {
    return <p className="text-center mt-4">Loading session...</p>;
  }



  return (
    <AdminLayout>
      <AdminAllApplicant/>
    </AdminLayout>
  );
};

export default ResumeAllApplicants;
