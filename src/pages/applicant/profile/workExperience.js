import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table, Card, Form, Row, Col } from "react-bootstrap";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";
import CreatableSelect from "react-select/creatable";
import { UniversalDataContext } from "../../../context/UniversalDataContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS

const WorkExperience = () => {
  const { institutions: availableInstitutions, positions: availablePositions } = useContext(UniversalDataContext);
  
  const [showModal, setShowModal] = useState(false);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [formData, setFormData] = useState({
    institution_id: null,
    position_id: null,
    from: "",
    to: "",
    isCurrentlyWorking: false,
    responsibilities: "",
  });
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const applicantId = localStorage.getItem("applicantId");


  // Character count limits
  const CHAR_LIMIT = 500;
  const MIN_CHAR_LIMIT = 300;

  // Fetch work experiences on component mount and after updates
  const fetchWorkExperiences = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/experiences/${applicantId}`);
      if (!response.ok) throw new Error("Failed to fetch work experiences");
      const data = await response.json();
      // console.log(data);
      setWorkExperiences(data);
      console.log("experience",workExperiences);
    } catch (error) {
      console.error("Error fetching work experiences:", error);
    }
  };

  useEffect(() => {
    fetchWorkExperiences();
  }, [applicantId]);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
    setEditingExperienceId(null);
  };

  const resetForm = () => {
    setFormData({
      institution_id: null,
      position_id: null,
      from: "",
      to: "",
      isCurrentlyWorking: false,
      responsibilities: "",
    });
  };

  const handleSubmit = async () => {
    const { institution_id, position_id, from, responsibilities } = formData;

    // Validate input data
    if (!institution_id || !position_id || !from || responsibilities.length < MIN_CHAR_LIMIT) {
      alert(`Please fill in all required fields. Responsibilities should be at least ${MIN_CHAR_LIMIT} characters.`);
      return;
    }

    const experienceData = {
      applicantId,
      institution_id,
      position_id,
      from,
      to: formData.isCurrentlyWorking ? "Present" : formData.to,
      responsibilities,
    };

    try {
   
      if (editingExperienceId) {
        const response = await fetch(`http://localhost:4000/api/applicant/experiences/${editingExperienceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(experienceData),
        });
        if (!response.ok) throw new Error("Failed to update work experience");
      } else {
        const response = await fetch(`http://localhost:4000/api/applicant/experiences/${applicantId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(experienceData),
        });
        if (!response.ok) throw new Error("Failed to add work experience");
      }

      // Refetch work experiences after adding/updating
      await fetchWorkExperiences();
      handleModalClose();
    } catch (error) {
      console.error("Error saving work experience:", error);
    }
  };

  const handleDelete = async (experienceId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/experiences/${experienceId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete work experience");

      // Refetch work experiences after deletion
      await fetchWorkExperiences();
    } catch (error) {
      console.error("Error deleting work experience:", error);
    }
  };

  const handleEdit = (experienceId) => {
    const experienceToEdit = workExperiences.find((exp) => exp.id === experienceId);
    if (experienceToEdit) {
      setFormData({
        institution_id: experienceToEdit.institution_id,
        position_id: experienceToEdit.position_id,
        from: experienceToEdit.from,
        to: experienceToEdit.to === "Present" ? "" : experienceToEdit.to,
        isCurrentlyWorking: experienceToEdit.to === "Present",
        responsibilities: experienceToEdit.responsibilities || "",
      });
      setEditingExperienceId(experienceId);
      setShowModal(true);
    }
  };

  const handleResponsibilitiesChange = (value) => {
    const plainText = value.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    if (plainText.length <= CHAR_LIMIT) {
      setFormData((prev) => ({ ...prev, responsibilities: value }));
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    alert("Pasting is not allowed in the responsibilities field.");
  };

  const handleKeyDown = (event) => {
    const currentLength = formData.responsibilities.replace(/<\/?[^>]+(>|$)/g, "").length;
    if (currentLength >= CHAR_LIMIT && event.key !== "Backspace") {
      event.preventDefault();
      alert(`You have reached the character limit of ${CHAR_LIMIT}. You cannot type more.`);
    }
  };

  const isResponsibilitiesLimitReached = () => {
    return formData.responsibilities.replace(/<\/?[^>]+(>|$)/g, "").length >= CHAR_LIMIT;
  };

  return (
    <ApplicantLayout>
      <Card className="">
        <div className="d-flex justify-content-end m-4">
          <Button variant="primary" onClick={handleModalShow}>
            Add Work Experience
          </Button>
        </div>
        <Card.Title className="text-center mb-4">Work Experience</Card.Title>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Institution/Organization</th>
                <th>Position</th>
                {/* <th>Responsibility</th> */}
                <th>From</th>
                <th>To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workExperiences.length > 0 ? (
                workExperiences.map((experience) => (
                  <tr key={experience.id}>
                    <td>{experience.institution}</td>
                    <td>{experience.position}</td>
                    {/* <td>{experience.responsibilities}</td> */}
                    <td>{experience.from}</td>
                    <td>{experience.to}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(experience.id)}>
                        Edit
                      </Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(experience.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No work experience added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for Add/Edit Work Experience */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingExperienceId ? "Edit Work Experience" : "Add Work Experience"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formInstitution">
              <Form.Label>Institution/Organization</Form.Label>
              <CreatableSelect
                options={availableInstitutions.map((inst) => ({ value: inst.id, label: inst.name }))}
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    institution_id: option ? option.value : option.label, // Keep label if new
                  }));
                }}
                value={
                  formData.institution_id
                    ? {
                        value: formData.institution_id,
                        label: availableInstitutions.find((inst) => inst.id === formData.institution_id)?.name || formData.institution_id,
                      }
                    : null
                }
                placeholder="Select or create an institution"
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Position</Form.Label>
              <CreatableSelect
                options={availablePositions.map((pos) => ({ value: pos.id, label: pos.name }))}
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    position_id: option ? option.value : option.label, // Keep label if new
                  }));
                }}
                value={
                  formData.position_id
                    ? {
                        value: formData.position_id,
                        label: availablePositions.find((pos) => pos.id === formData.position_id)?.name || formData.position_id,
                      }
                    : null
                }
                placeholder="Select or create a position"
              />
            </Form.Group>

            <Row className="mt-3">
              <Col>
                <Form.Group controlId="formFrom">
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.from}
                    onChange={(e) => setFormData((prev) => ({ ...prev, from: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formTo">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.isCurrentlyWorking ? "" : formData.to}
                    onChange={(e) => setFormData((prev) => ({ ...prev, to: e.target.value }))}
                    disabled={formData.isCurrentlyWorking}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label="Currently Working"
                checked={formData.isCurrentlyWorking}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, isCurrentlyWorking: e.target.checked }));
                  if (e.target.checked) {
                    setFormData((prev) => ({ ...prev, to: "" })); // Reset "to" date if currently working
                  }
                }}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Responsibilities</Form.Label>
              <ReactQuill
                value={formData.responsibilities}
                onChange={handleResponsibilitiesChange}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                modules={{ toolbar: [["bold", "italic", "underline"], ["clean"]] }}
                placeholder="Describe your responsibilities here"
              />
              <div className="text-right mt-1">
                <span>
                  {formData.responsibilities.replace(/<\/?[^>]+(>|$)/g, "").length}/{CHAR_LIMIT} characters
                </span>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingExperienceId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </ApplicantLayout>
  );
};

export default WorkExperience;
