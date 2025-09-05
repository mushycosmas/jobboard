import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table, Card } from "react-bootstrap";
import CreatableSelect from "react-select/creatable"; // Import CreatableSelect
import { UniversalDataContext } from "../../../context/UniversalDataContext";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";

const ApplicantSkillsComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [applicantSkills, setApplicantSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const { skills: availableSkills } = useContext(UniversalDataContext);
  const applicantId = localStorage.getItem("applicantId");

  // Transform availableSkills to react-select format
  const skillOptions = availableSkills.map(skill => ({
    value: skill.id,
    label: skill.name, // Ensure you use the correct property for the label
  }));

  // Fetch applicant's skills
  const fetchApplicantSkills = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/skills/${applicantId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        // Update the state with the correct skills structure
        const skills = data.map(item => ({
          id: item.id,
          skill_name: item.skill_name,
        }));
        setApplicantSkills(skills);
      } else {
        console.error("Error fetching skills:", await response.json());
      }
    } catch (error) {
      console.error("Error fetching applicant skills:", error);
    }
  };

  useEffect(() => {
    fetchApplicantSkills();
  }, [applicantId]);

  // Add new skills
  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill.");
      return;
    }

    try {
      // Prepare the data to send to the server
      const skillsToSubmit = selectedSkills.map(skill => ({
        skill_id: isNaN(skill.value) ? skill.label : skill.value, // Use label for new skills
        applicant_id: applicantId,
      }));

      // Send data to the server
      const response = await fetch(`http://localhost:4000/api/applicant/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillsToSubmit), // Send all skills in one request
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedSkills([]);
        fetchApplicantSkills(); // Refresh skills after submission
      } else {
        console.error("Error adding skills:", await response.json());
      }
    } catch (error) {
      console.error("Error adding skills:", error);
      alert("An error occurred while adding skills. Please try again.");
    }
  };

  // Delete a skill
  const handleDelete = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/skills/${skillId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchApplicantSkills(); // Refresh skills after deletion
        } else {
          console.error("Error deleting skill:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <ApplicantLayout>
      <Card className="">
        <div className="d-flex justify-content-end m-4">
          <Button variant="primary" onClick={handleModalShow}>
            Add Skill
          </Button>
        </div>
        <Card.Title className="text-center mb-4">Applicant Skills</Card.Title>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicantSkills.length > 0 ? (
                applicantSkills.map((skill) => (
                  <tr key={skill.id}>
                    <td>{skill.skill_name}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No skills found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Skill Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Skills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreatableSelect
            options={skillOptions}
            isMulti
            onChange={setSelectedSkills}
            placeholder="Select or create skills"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </ApplicantLayout>
  );
};

export default ApplicantSkillsComponent;
