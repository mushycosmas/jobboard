'use client'
import React, { createContext, useState, useEffect } from 'react';

// Create the Context
export const UniversalDataContext = createContext();

const UniversalDataProvider = ({ children }) => {
  // Universal data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [jobTypes, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [jobPrograms, setJobPrograms] = useState([]);  // Job Programs/Courses
  const [educationLevels, setEducationLevels] = useState([]);  // Education Levels
  const [institutions, setInstitutions] = useState([]); // Institutions/Organizations
  const [languages, setLanguages] = useState([]); // Languages
  const [languageWrite, setLanguageWrite] = useState([]); // LanguagesWrite
  const [languageRead, setLanguageRead] = useState([]); // LanguagesRead
  const [languageSpeak, setLanguageSpeak] = useState([]); // Languages speak
  const [positions, setPositions] = useState([]); // Positions
  const [courses, setCourses] = useState([]); // courses
  const [programmes, setProgrammes] = useState([]); // courses
  const [genders, setGenders] = useState([]); // courses
  const [maritalStatus, setMaritalStatus] = useState([]); // courses
  const [socialMedias, setSocialMedia] = useState([]); // courses
  const [savedCollections, setSavedCollection] = useState([]); // courses
  
  useEffect(() => {
    // Fetch or hardcode universal data here (mock example)
    setCountries([
      { id: 1, name: 'United States' },
      { id: 2, name: 'India' },
      { id: 3, name: 'Germany' }
    ]);

    setSavedCollection([
      { id: 1, name: 'Hr' },
      { id: 2, name: 'IT' },
      { id: 3, name: 'Accountant' }
    ]);

    setSkills([
      { id: 1, name: 'ChatGPT' },
      { id: 2, name: 'Office' },
      { id: 3, name: 'Linux' }
    ]);

    setCultures([
      { id: 1, name: 'American' },
      { id: 2, name: 'Indian' },
      { id: 3, name: 'German' }
    ]);

    setTypes([
      { id: 1, name: 'Full-Time' },
      { id: 2, name: 'Part-Time' },
      { id: 3, name: 'Contract' }
    ]);

    setExperiences([
      { id: 1, name: '1-3 years' },
      { id: 2, name: '3-5 years' },
      { id: 3, name: '5+ years' }
    ]);

    setLevels([
      { id: 1, name: 'Junior' },
      { id: 2, name: 'Mid' },
      { id: 3, name: 'Senior' }
    ]);

    setStates([
      { id: 1, name: 'California', countryId: 1 },
      { id: 2, name: 'New York', countryId: 1 },
      { id: 3, name: 'Maharashtra', countryId: 2 }
    ]);

    setCategories([
      { id: 1, name: 'Engineering', slug: 'engineering' },
      { id: 2, name: 'Finance', slug: 'bank-and-financing' },
      { id: 3, name: 'Marketing', slug: 'marketing' },
      { id: 4, name: 'Test', slug: 'test' },
      
    ]);

    // Add sample job programs/courses
    setJobPrograms([
      { id: 1, name: 'Computer Science' },
      { id: 2, name: 'Business Administration' },
      { id: 3, name: 'Data Science' }
    ]);

    // Add  programs
    setProgrammes([
      { id: 1, name: 'BA Computer Science' },
      { id: 2, name: 'BA Business Administration' },
      { id: 3, name: 'BA Data Science' }
    ]);
 // Add sample course
   setCourses([
   { id: 1, name: 'Computer Science' },
   { id: 2, name: 'cloud computing' },
   { id: 3, name: 'CPA' }
   ]);
    // Add sample education levels
    setEducationLevels([
      { id: 1, name: 'High School' },
      { id: 2, name: 'Associate Degree' },
      { id: 3, name: 'Bachelor\'s Degree' },
      { id: 4, name: 'Master\'s Degree' },
      { id: 5, name: 'Doctorate' }
    ]);

    // Add sample institutions/organizations
    setInstitutions([
      { id: 1, name: 'Harvard University' },
      { id: 2, name: 'Stanford University' },
      { id: 3, name: 'MIT' }
    ]);

    // Add sample languages
    setLanguages([
      { id: 1, name: 'English' },
      { id: 2, name: 'Spanish' },
      { id: 3, name: 'German' },
      { id: 4, name: 'Hindi' }
    ]);

    setLanguageRead([
      { id: 1, name: 'Very Good' },
      { id: 2, name: 'Good' },
      { id: 3, name: 'Fair' },
      { id: 4, name: 'Poor' }
    ]);
    
    setLanguageSpeak([
      { id: 1, name: 'Very Good' },
      { id: 2, name: 'Good' },
      { id: 3, name: 'Fair' },
      { id: 4, name: 'Poor' }
    ]);
    setLanguageWrite([
      { id: 1, name: 'Very Good' },
      { id: 2, name: 'Good' },
      { id: 3, name: 'Fair' },
      { id: 4, name: 'Poor' }
    ]);
    // Add sample positions
    setPositions([
      { id: 1, name: 'Software Engineer' },
      { id: 2, name: 'Project Manager' },
      { id: 3, name: 'Data Scientist' },
      { id: 4, name: 'UX Designer' }
    ]);
    setGenders([
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
   
    ]);
    setMaritalStatus([
      { id: 1, name: 'Single' },
      { id: 2, name: 'Married' },
      { id: 3, name: 'Divorce' },
      
    ]);
    setSocialMedia([
      { id: 1, name: 'Facebook' },
      { id: 2, name: 'Linkedin' },
      { id: 3, name: 'Intagram' },
      { id: 4, name: 'Twitter' },
      
    ]);
  }, []);

  return (
    <UniversalDataContext.Provider value={{
      countries,
      states,
      categories,
      skills,
      jobTypes,
      levels,
      cultures,
      experiences,
      jobPrograms,  // Providing jobPrograms
      educationLevels,  // Providing educationLevels
      institutions, // Providing institutions/organizations
      languages,    // Providing languages
      languageRead,
      languageSpeak,
      languageWrite,
      positions,
      courses,
      programmes,
      genders,
      maritalStatus,
      socialMedias,
      savedCollections
    }}>
      {children}
    </UniversalDataContext.Provider>
  );
};

export default UniversalDataProvider;
