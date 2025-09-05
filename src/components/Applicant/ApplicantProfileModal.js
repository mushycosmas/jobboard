import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './../../styles/cv/template1.module.css';
import CreatableSelect from "react-select/creatable"; 
import Select from "react-select"; // Import Select

const ApplicantProfileModal = ({
  positions,
  categories,
  savedCollections,
  applicantData,
  experiencesData,
  skills,
  socialMediaLinks,
  setShowProfileModal,
  employerId,
  educationalQualifications = [],
  professionalQualifications = [],
  saveProfile,  // Function passed in to handle saving the profile
}) => {
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [category, setCategory] = useState(null); // State to store selected category
  const [applicantId, setApplicantId] = useState(applicantData.id || '');  // Assuming applicantData has an id field
  const [position, setPosition] = useState(null); // State to store selected position
  const [folderName, setFolderName] = useState(''); // State to store folder name

  console.log("employerId", employerId);

  const handleSave = () => {
    // Call the saveProfile function, which could trigger an API call or update state
    if (saveProfile) {
      saveProfile(applicantData); // Pass applicant data to save function
    }
    setShowProfileModal(true); // Close the first modal

    // After saving, show the second modal
    setShowSecondModal(true);
  };

  const handleSecondModalSubmit = async () => {
    // Handle the submission of the second modal (e.g., make an API call or update state)
    const formData = {
      category_id: category ? category.value : null, // Send the category ID
      position_id: position ? position.value : null, // Send the position ID
      collection_id: folderName ? folderName.value : null, // Send the folder ID
      employer_id: employerId, // Send the employer ID
      applicant_id: applicantId, // Send the applicant ID
    };
  
    console.log('Form data to save:', formData);
  
    try {
      // Sending the formData to your API using fetch
      const response = await fetch('http://localhost:4000/api/universals/saved-resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(formData), // Convert formData to JSON string
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Data saved successfully:', responseData);
        
        // Alert user on successful save
        alert('Data saved successfully!');
  
        // Optionally, you can close the modal here as well
        setShowSecondModal(false);
      } else {
        console.error('Error saving data:', response.statusText);
        alert('Error saving data! Please try again.');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('An error occurred while saving data! Please try again.');
    }
  
    // Close the second modal after submission (if not closed already in the success block)
    setShowSecondModal(false);
  };
  
  

  return (
    <>
      {/* First Modal - Applicant Profile */}
      <Modal show={true} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{applicantData.first_name} {applicantData.last_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applicantData ? (
            <div>
              <div className={styles.cvContainer}>
                <div className={styles.sidebar}>
                  <div className="profile">
                    <img
                      src={applicantData.logo ? `http://localhost:4000${applicantData.logo}` : 'https://via.placeholder.com/100'}
                      alt="Profile"
                      className={styles.profileImg}
                    />
                    <h2 className={styles.profileName}>{applicantData.first_name} {applicantData.last_name}</h2>
                    <p className={styles.profileTitle}>Senior Software Engineer</p>
                    <div className={styles.profileContact}>
                      <p>Email: {applicantData.email}</p>
                      <p>Phone: {applicantData.phone_number}</p>
                    </div>
                  </div>
                  <div className={styles.links}>
                    {socialMediaLinks.length > 0 ? (
                      socialMediaLinks.map((link) => (
                        <p key={link.id}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">{link.social_media_name}</a>
                        </p>
                      ))
                    ) : (
                      <p>No social media links available</p>
                    )}
                  </div>
                </div>

                <div className={styles.mainContent}>
                  {/* About Me Section */}
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>About Me</h3>
                    <p>{applicantData.about || "No about section provided."}</p>
                  </section>

                  {/* Work Experience Section */}
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Work Experience</h3>
                    {experiencesData.length > 0 ? (
                      <ul>
                        {experiencesData.map((experience) => (
                          <li key={experience.id}>
                            <h4>{experience.position} | {experience.institution}</h4>
                            <p>
                              <strong>
                                {new Date(experience.from).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })} - 
                                {experience.to === "Present" 
                                  ? "Present" 
                                  : new Date(experience.to).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                              </strong>
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No work experience available</p>
                    )}
                  </section>

                  {/* Education Section */}
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Education</h3>
                    {educationalQualifications.length > 0 ? (
                      <ul>
                        {educationalQualifications.map((qualification) => (
                          <li key={qualification.id}>
                            <h4>{qualification.education_level} {qualification.programme}</h4>
                            <p>
                              <strong>{qualification.institution}</strong> | Graduated in  
                              {new Date(qualification.ended).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No education data available</p>
                    )}
                  </section>

                  {/* Skills Section */}
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Skills</h3>
                    {skills.length > 0 ? (
                      <div className={styles.skills}>
                        {skills.map((skill) => (
                          <span key={skill.id} className={styles.skill}>{skill.skill_name}</span>
                        ))}
                      </div>
                    ) : (
                      <p>No skills data available</p>
                    )}
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading applicant data...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Profile
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Second Modal - Save Additional Info */}
      <Modal show={showSecondModal} onHide={() => setShowSecondModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>{applicantData.first_name} {applicantData.last_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Select
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                value={category}
                onChange={(selectedOption) => setCategory(selectedOption)}
                placeholder="Select a category"
              />
            </Form.Group>

            <Form.Group controlId="position">
              <Form.Label>Position</Form.Label>
              <CreatableSelect
                options={positions.map((pos) => ({
                  value: pos.id,
                  label: pos.name,
                }))}
                value={position}
                onChange={(selectedOption) => setPosition(selectedOption)}
                onCreateOption={(inputValue) =>
                  setPosition({ value: inputValue, label: inputValue })
                }
                placeholder="Select or create a position"
              />
            </Form.Group>

            <Form.Group controlId="folderName">
  <Form.Label>Folder Name</Form.Label>
  <CreatableSelect
    options={savedCollections.map((collection) => ({
      value: collection.id,
      label: collection.name,
    }))}
    value={folderName ? { value: folderName.value, label: folderName.label } : null} // Ensure correct structure
    onChange={(selectedOption) => {
      setFolderName(selectedOption); // Store the whole selected option
    }}
    onCreateOption={(inputValue) => {
      const newFolder = { value: inputValue, label: inputValue }; // Create a new folder object
      setFolderName(newFolder); // Set the new folder
    }}
    placeholder="Select or create a folder name"
  />
</Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSecondModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSecondModalSubmit}>
            Save Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApplicantProfileModal;
