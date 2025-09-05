import React, { useState, useEffect, useContext } from 'react';
import EmployerLayout from '../../../Layouts/EmployerLayout';// Assuming this is your layout
import JobApplicants from '../../../components/Job/JobApplicants';
import { fetchTotalExperience, fetchApplicantData, fetchSkills, fetchSocialMediaLinks } from '../../../api/api';
import StageApplicantProfileModal from '../../../components/Applicant/StageApplicantProfileModal';
import { UniversalDataContext } from '../../../context/UniversalDataContext';
const JobApplicationPage = () => {


  const [totalExperience, setTotalExperience] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [applicantData, setApplicantData] = useState(null);
  const { categories,positions} = useContext(UniversalDataContext);
  const employerId = localStorage.getItem('employerId');
  const [applicationId, setApplicationId] = useState(null);


  const handleRowClick = async (applicantId,applicationId) => {
    try {
      // Fetch the applicant's detailed data
      const experienceData = await fetchTotalExperience(applicantId);
      setTotalExperience(experienceData);

      const applicantDetails = await fetchApplicantData(applicantId);
      setApplicantData(applicantDetails);

      const skillsData = await fetchSkills(applicantId);
      setSkills(skillsData);

      const socialLinksData = await fetchSocialMediaLinks(applicantId);
      setSocialMediaLinks(socialLinksData);
      setApplicationId(applicationId); // ✅ Set the application ID
      // Open the profile modal
      setShowProfileModal(true);  // This will show the profile modal
    } catch (error) {
      console.error('Error fetching applicant data:', error);
    }
  };


  return (
    <EmployerLayout>
      <JobApplicants  handleRowClick={handleRowClick} />

      {showProfileModal && (
            <StageApplicantProfileModal
              applicantData={applicantData}
              experiencesData={totalExperience}
              skills={skills}
              socialMediaLinks={socialMediaLinks}
              categories={categories}
               positions={positions}
               applicationId={applicationId}
              
               employerId={employerId}
              setShowProfileModal={setShowProfileModal} // Close modal when this function is called
            />
          )}

    </EmployerLayout>

   
  );
};

export default JobApplicationPage;
