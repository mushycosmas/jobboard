import React, { useState, useContext, useEffect } from "react";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";
import { Button, Modal, Form, Table, Card, Row, Col } from "react-bootstrap";
import { UniversalDataContext } from "../../../context/UniversalDataContext";

const LanguageProficiency = () => {
  const API_BASE_URL = "http://localhost:4000/api/applicant";

  const [showModal, setShowModal] = useState(false);

  // Fetch data from UniversalDataContext
  const { languages, languageRead, languageSpeak, languageWrite } = useContext(UniversalDataContext);

  // State for saved languages and form data
  const applicantId = localStorage.getItem("applicantId");

  const [savedLanguages, setSavedLanguages] = useState([]);
  const [formData, setFormData] = useState({
    language_id: "",
    speak_id: "",
    read_id: "",
    write_id: "",
  });

  // Modal control
  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Fetch saved languages when the component mounts or after a language is added or deleted
  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/languages/${applicantId}`);
      if (response.ok) {
        const data = await response.json();
        setSavedLanguages(data);
      } else {
        console.error("Error fetching languages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  // Call fetchLanguages when the component mounts
  useEffect(() => {
    fetchLanguages();
  }, [applicantId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/languages/${applicantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newLanguage = await response.json();
        // After successful POST, re-fetch the languages to get the updated list
        fetchLanguages();
        setFormData({
          language_id: "",
          speak_id: "",
          read_id: "",
          write_id: "",
        }); // Reset form
        setShowModal(false);
      } else {
        console.error("Error adding language:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  // Handle deletion of a saved language
  const handleDelete = async (languageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/languages/${languageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // After successful DELETE, re-fetch the languages to get the updated list
        fetchLanguages();
      } else {
        console.error("Error deleting language:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  return (
    <ApplicantLayout>
      <Card>
        <div className="d-flex justify-content-end m-4">
          <Button variant="primary" onClick={handleModalShow}>
            Add Language Proficiency
          </Button>
        </div>
        <Card.Title className="text-center mb-4">Language Proficiency</Card.Title>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Language</th>
                <th>Speak</th>
                <th>Read</th>
                <th>Write</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedLanguages.map((language) => (
                <tr key={language.id}>
                  <td>{language.name}</td>
                  <td>{language.speaking_skill}</td>
                  <td>{language.reading_skill}</td>
                  <td>{language.writing_skill}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(language.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for Adding Language Proficiency */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Language Proficiency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLanguage">
              <Form.Label>Language</Form.Label>
              <Form.Control
                as="select"
                name="language_id"
                onChange={handleChange}
                value={formData.language_id}
                required
              >
                <option value="">---Select---</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Row>
              <Col xs={12} md={4}>
                <Form.Group controlId="formSpeak">
                  <Form.Label>Speak</Form.Label>
                  <Form.Control
                    as="select"
                    name="speak_id"
                    onChange={handleChange}
                    value={formData.speak_id}
                    required
                  >
                    <option value="">---Select---</option>
                    {languageSpeak.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="formRead">
                  <Form.Label>Read</Form.Label>
                  <Form.Control
                    as="select"
                    name="read_id"
                    onChange={handleChange}
                    value={formData.read_id}
                    required
                  >
                    <option value="">---Select---</option>
                    {languageRead.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="formWrite">
                  <Form.Label>Write</Form.Label>
                  <Form.Control
                    as="select"
                    name="write_id"
                    onChange={handleChange}
                    value={formData.write_id}
                    required
                  >
                    <option value="">---Select---</option>
                    {languageWrite.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
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

export default LanguageProficiency;
