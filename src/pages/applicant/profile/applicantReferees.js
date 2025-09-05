import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Card } from "react-bootstrap";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";

const ApplicantReferees = () => {
  // State to handle the modal visibility
  const [showModal, setShowModal] = useState(false);
  const applicantId = localStorage.getItem('applicantId');
  // State for storing referees data
  const [referees, setReferees] = useState([]);

  console.log(applicantId);
  // State for form data when adding/editing a referee
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    institution: "",
    email: "",
    phone: "",
    referee_position: "",
  });

  // State to track which referee is being edited
  const [editingRefereeId, setEditingRefereeId] = useState(null);


  // Fetch referees from the API
  const fetchReferees = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/referees/${applicantId}`);
      const data = await response.json();

      // Ensure data is an array, even if the API returns null or an unexpected format
      setReferees(Array.isArray(data) ? data : []);  // Use empty array if data is not an array
    } catch (error) {
      console.error("Error fetching referees:", error);
      setReferees([]);  // In case of error, set referees to an empty array
    }
  };

  // Fetch referees on initial load
  useEffect(() => {
    fetchReferees();
  }, [applicantId]);

  // Handle modal show and hide
  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setEditingRefereeId(null);  // Reset editing referee when modal is closed
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit (Add or Update Referee)
  const handleSubmit = async () => {
    // Basic validation for first_name and last_name
    if (!formData.first_name || !formData.last_name) {
      alert("First Name and Last Name are required.");
      return;  // Prevent form submission if there are errors
    }

    try {
      const newReferee = { ...formData, applicant_id: applicantId };

      if (editingRefereeId) {
        // Update existing referee by refereeId
        const response = await fetch(`http://localhost:4000/api/applicant/referees/${editingRefereeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReferee),
        });
        const data = await response.json();
        
        // Refresh the referees list after updating
        fetchReferees();

        // Clear form and close modal
        setEditingRefereeId(null);
        setFormData({
          first_name: "",
          last_name: "",
          institution: "",
          email: "",
          phone: "",
          referee_position: "",
        });
        setShowModal(false);

      } else {
        // Create new referee
        const response = await fetch(`http://localhost:4000/api/applicant/referees/${applicantId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReferee),
        });
        const data = await response.json();
        
        // Refresh the referees list after adding a new referee
        fetchReferees();

        // Clear form and close modal
        setFormData({
          first_name: "",
          last_name: "",
          institution: "",
          email: "",
          phone: "",
          referee_position: "",
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error adding/updating referee:", error);
    }
  };

  // Handle deleting a referee by refereeId
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/applicant/referees/${id}`, {
        method: "DELETE",
      });

      // Refresh the referees list after deleting a referee
      fetchReferees();
    } catch (error) {
      console.error("Error deleting referee:", error);
    }
  };

  // Handle editing a referee (populate form with selected referee data)
  const handleEdit = (referee) => {
    setFormData({
      first_name: referee.first_name,
      last_name: referee.last_name,
      institution: referee.institution,
      email: referee.email,
      phone: referee.phone,
      referee_position: referee.referee_position,
    });
    setEditingRefereeId(referee.id);  // Set the referee ID to indicate editing
    setShowModal(true);
  };

  return (
    <ApplicantLayout>
      <Card>
        <div className="d-flex justify-content-end m-4">
          <Button variant="primary" onClick={handleModalShow}>
            Add Referee
          </Button>
        </div>

        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Institution/Organization</th>
                <th>Position</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(referees) && referees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No referees available.
                  </td>
                </tr>
              ) : (
                referees.map((referee) => (
                  <tr key={referee.id}>
                    <td>{referee.first_name} {referee.last_name}</td>
                    <td>{referee.institution}</td>
                    <td>{referee.referee_position}</td>
                    <td>{referee.email}</td>
                    <td>{referee.phone}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(referee)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(referee.id)}  
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for adding/editing a referee */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRefereeId ? "Edit Referee" : "Add Referee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* First Name */}
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
                required
              />
            </Form.Group>

            {/* Last Name */}
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                onChange={handleChange}
                value={formData.last_name}
                required
              />
            </Form.Group>

            {/* Institution */}
            <Form.Group controlId="formInstitution">
              <Form.Label>Institution/Organization</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                onChange={handleChange}
                value={formData.institution}
                required
              />
            </Form.Group>

            {/* Referee Position */}
            <Form.Group controlId="formRefereePosition">
              <Form.Label>Referee Position</Form.Label>
              <Form.Control
                type="text"
                name="referee_position"
                onChange={handleChange}
                value={formData.referee_position}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                onChange={handleChange}
                value={formData.phone}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingRefereeId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </ApplicantLayout>
  );
};

export default ApplicantReferees;
