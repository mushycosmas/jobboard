import React from "react";
import EmployerLayout from '../../../Layouts/EmployerLayout';
import GetAllApplicant from "../../../components/Applicant/GetAllApplicant";
const employerId = localStorage.getItem('employerId');

const ResumeAllApplicants=()=>{

    return (
    <EmployerLayout>

    <GetAllApplicant
      employerId={employerId}
    />

    </EmployerLayout>
    )

}


export default ResumeAllApplicants;