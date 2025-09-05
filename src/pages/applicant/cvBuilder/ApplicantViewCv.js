import React, { useState, useEffect } from "react";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";
import Template1 from "../../../components/Cv/Template1";

const ApplicantViewCv = () => {
  const [applicantData, setApplicantData] = useState(null);
  const [educationalQualifications, setEducationalQualifications] = useState([]);
  const [professionalQualifications, setProfessionalQualifications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [referees, setReferees] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]); // New state for social media links

  const applicantId = 43; // Replace with the actual applicant ID from context or props

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/${applicantId}`);
        const data = await response.json();
        console.log(data);
        setApplicantData(data[0] || null); // Set applicantData to null if no data is returned
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      }
    };

    const fetchEducationalQualifications = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/educational-qualifications/${applicantId}`);
        const data = await response.json();
        setEducationalQualifications(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching educational qualifications:", error);
      }
    };

    const fetchProfessionalQualifications = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/professional-qualifications/${applicantId}`);
        const data = await response.json();
        setProfessionalQualifications(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching professional qualifications:", error);
      }
    };

    const fetchExperiences = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/experiences/${applicantId}`);
        const data = await response.json();
        setExperiences(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/languages/${applicantId}`);
        const data = await response.json();
        setLanguages(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/skills/${applicantId}`);
        const data = await response.json();
        setSkills(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const fetchReferees = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/referees/${applicantId}`);
        const data = await response.json();
        setReferees(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching referees:", error);
      }
    };

    // Fetch social media links
    const fetchSocialMediaLinks = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/social-media/${applicantId}`);
        if (response.ok) {
          const data = await response.json();
          setSocialMediaLinks(data);
        } else {
          console.error("Error fetching social media links:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching applicant social media links:", error);
      }
    };

    // Fetch all data
    fetchApplicantData();
    fetchEducationalQualifications();
    fetchProfessionalQualifications();
    fetchExperiences();
    fetchLanguages();
    fetchSkills();
    fetchReferees();
    fetchSocialMediaLinks(); // Call the new fetch function
  }, [applicantId]);

  // Extract necessary applicant details with null checks
  const applicantProfile = applicantData ? {
    name: `${applicantData.first_name || 'N/A'} ${applicantData.last_name || 'N/A'}`,
    email: applicantData.email || 'N/A',
    about: applicantData.about || 'N/A',
    phone: applicantData.phone_number || 'N/A',
    profileImage: `http://localhost:4000${applicantData.logo }` || "https://via.placeholder.com/150", // Default image if not available
  } : {
    name: 'N/A',
    email: 'N/A',
    email: 'N/A',
    phone: 'N/A',
    about: 'N/A',
    profileImage: "https://via.placeholder.com/150",
  };

  return (
    <ApplicantLayout>
      <Template1 
        profile={applicantProfile} 
        educationalQualifications={educationalQualifications} 
        professionalQualifications={professionalQualifications} 
        experiences={experiences} 
        languages={languages} 
        skills={skills} 
        referees={referees} 
        socialMediaLinks={socialMediaLinks} // Pass social media links to Template1
      />
    </ApplicantLayout>
  );
};

export default ApplicantViewCv;
