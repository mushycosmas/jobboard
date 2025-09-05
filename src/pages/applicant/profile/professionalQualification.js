import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Form, Table, Card, Row, Col } from 'react-bootstrap';
import ApplicantLayout from "../../../Layouts/ApplicantLayout";
import { UniversalDataContext } from "../../../context/UniversalDataContext";
import CreatableSelect from "react-select/creatable";

// Define the API base URL
const API_BASE_URL = "http://localhost:4000/api/applicant";

// Function to format date to YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ProfessionalQualifications = () => {
  const [showModal, setShowModal] = useState(false);
  const [savedQualifications, setSavedQualifications] = useState([]); 
  const applicantId = localStorage.getItem("applicantId");
  const [formData, setFormData] = useState({
    id: null,  // Add an ID field to track if we're editing
    applicant_id: applicantId, 
    country_id: '',
    institution_id: '',
    course_id: '',
    attachment: '',
    started: '', 
    ended: '',  
    updator_id: '', 
    creator_id: '', 
  });

  const { institutions: availableInstitutions, courses: availableCourses, countries } = useContext(UniversalDataContext);

  const fetchQualifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/professional-qualifications/${applicantId}`);
      if (!response.ok) throw new Error("Failed to fetch qualifications");
      const data = await response.json();
      setSavedQualifications(data);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, [applicantId]);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ 
      id: null,
      applicant_id: applicantId, 
      country_id: '',
      institution_id: '',
      course_id: '',
      attachment: '',
      started: '',
      ended: '',
      updator_id: '',
      creator_id: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleCreatableChange = (name, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? newValue.value : '', 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("applicant_id", formData.applicant_id);
    formDataToSubmit.append("country_id", formData.country_id || null); 
    formDataToSubmit.append("institution_id", formData.institution_id || null);
    formDataToSubmit.append("course_id", formData.course_id || null);
    formDataToSubmit.append("started", formData.started || null);  // Already formatted
    formDataToSubmit.append("ended", formData.ended || null);      // Already formatted
    formDataToSubmit.append("updator_id", formData.updator_id || null);
    formDataToSubmit.append("creator_id", formData.creator_id || null);
    
    if (formData.attachment) { 
      formDataToSubmit.append("attachment", formData.attachment); 
    }

    try {
      let response;
      if (formData.id) {
        // If we have an `id`, it's an update (PUT request)
        response = await fetch(`${API_BASE_URL}/professional-qualifications/${formData.id}`, {
          method: 'PUT',
          body: formDataToSubmit,
        });
      } else {
        // Otherwise, it's a new qualification (POST request)
        response = await fetch(`${API_BASE_URL}/professional-qualifications/${applicantId}`, {
          method: 'POST',
          body: formDataToSubmit,
        });
      }

      if (!response.ok) {
        throw new Error('Error saving professional qualification');
      }

      const updatedQualification = await response.json();
      if (formData.id) {
        // Update the existing qualification in the list
        setSavedQualifications(savedQualifications.map(q => 
          q.id === formData.id ? updatedQualification : q
        ));
      } else {
        // Add the new qualification to the list
        setSavedQualifications([...savedQualifications, updatedQualification]);
      }

      setShowModal(false);
      fetchQualifications();
    } catch (error) {
      console.error("Error saving professional qualification:", error);
    }
  };

  const handleDelete = async (qualificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/professional-qualifications/${qualificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting qualification');
      }

      setSavedQualifications(savedQualifications.filter(qualification => qualification.id !== qualificationId));
      fetchQualifications();
    } catch (error) {
      console.error("Error deleting qualification:", error);
    }
  };

  const handleEdit = (qualificationId) => {
    const qualificationToEdit = savedQualifications.find(q => q.id === qualificationId);
    
    if (qualificationToEdit) {
      setFormData({
        id: qualificationToEdit.id, // Set the id for the qualification being edited
        applicant_id: applicantId,
        country_id: qualificationToEdit.country_id,
        institution_id: qualificationToEdit.institution_id,
        course_id: qualificationToEdit.course_id,
        attachment: qualificationToEdit.attachment || '',
        started: formatDate(qualificationToEdit.started), // Format start date
        ended: formatDate(qualificationToEdit.ended),     // Format end date
        updator_id: '', 
        creator_id: qualificationToEdit.creator_id,
      });
      setShowModal(true);
    }
  };

  return (
    <ApplicantLayout>
      <Card>
        <div className="d-flex justify-content-end m-4">
          <Button variant="primary" onClick={handleModalShow}>
            Add Professional Qualification
          </Button>
        </div>
        
        <Card.Title className="text-center">Professional Qualifications</Card.Title>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Country</th>
                <th>Institution</th>
                <th>Course</th>
                <th>Attachment</th>
                <th>Started</th>
                <th>Ended</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedQualifications.length > 0 ? (
                savedQualifications.map((qualification, index) => (
                  <tr key={index}>
                    <td>{qualification.country}</td>
                    <td>{qualification.institution}</td>
                    <td>{qualification.course}</td>
                    <td>{qualification.attachment || "No Attachment"}</td>
                    <td>{new Date(qualification.started).toLocaleDateString()}</td>
                    <td>{new Date(qualification.ended).toLocaleDateString()}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(qualification.id)}>
                        Edit
                      </Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(qualification.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No qualifications added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit Professional Qualification" : "Add Professional Qualification"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
              <Form.Group controlId="institution">
  <Form.Label>Institution</Form.Label>
  <CreatableSelect
    isClearable
    onChange={(selectedOption) => handleCreatableChange('institution_id', selectedOption)}
    onCreateOption={(inputValue) => {
      const newOption = { label: inputValue, value: inputValue }; // Assume value matches label for new entries
      setFormData((prev) => ({ ...prev, institution_id: newOption.value }));
      availableInstitutions.push(newOption); // Add to available options
    }}
    value={
      formData.institution_id
        ? {
            label: availableInstitutions.find(inst => inst.id === formData.institution_id)?.name || formData.institution_id,
            value: formData.institution_id
          }
        : null
    }
    options={availableInstitutions.map(inst => ({ label: inst.name, value: inst.id }))}
    required
  />
</Form.Group>


              </Col>
            </Row>
            <Row>
              <Col md={6}>
                
<Form.Group controlId="course">
  <Form.Label>Course</Form.Label>
  <CreatableSelect
    isClearable
    onChange={(selectedOption) => handleCreatableChange('course_id', selectedOption)}
    onCreateOption={(inputValue) => {
      const newOption = { label: inputValue, value: inputValue }; // Assume value matches label for new entries
      setFormData((prev) => ({ ...prev, course_id: newOption.value }));
      availableCourses.push(newOption); // Add to available options
    }}
    value={
      formData.course_id
        ? {
            label: availableCourses.find(course => course.id === formData.course_id)?.name || formData.course_id,
            value: formData.course_id
          }
        : null
    }
    options={availableCourses.map(course => ({ label: course.name, value: course.id }))}
    required
  />
</Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="started">
                  <Form.Label>Started</Form.Label>
                  <Form.Control
                    type="date"
                    name="started"
                    value={formData.started}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="ended">
                  <Form.Label>Ended</Form.Label>
                  <Form.Control
                    type="date"
                    name="ended"
                    value={formData.ended}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="attachment">
              <Form.Label>Attachment</Form.Label>
              <Form.Control
                type="file"
                name="attachment"
                onChange={handleFileChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </ApplicantLayout>
  );
};

export default ProfessionalQualifications;
