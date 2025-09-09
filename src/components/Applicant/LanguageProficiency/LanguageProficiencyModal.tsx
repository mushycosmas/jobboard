import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { LanguageData } from "./LanguageProficiency";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: LanguageData) => void;
  editingLanguage: LanguageData | null;
  languages: { id: string; name: string }[];
  languageSpeak: { id: string; name: string }[];
  languageRead: { id: string; name: string }[];
  languageWrite: { id: string; name: string }[];
}

const LanguageProficiencyModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  editingLanguage,
  languages,
  languageSpeak,
  languageRead,
  languageWrite,
}) => {
  const [formData, setFormData] = useState<LanguageData>({
    language_id: "",
    speak_id: "",
    read_id: "",
    write_id: "",
  });

  useEffect(() => {
    if (editingLanguage) setFormData(editingLanguage);
    else
      setFormData({
        language_id: "",
        speak_id: "",
        read_id: "",
        write_id: "",
      });
  }, [editingLanguage]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingLanguage ? "Edit Language" : "Add Language"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formLanguage">
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              name="language_id"
              value={formData.language_id}
              onChange={handleChange}
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

          <Row className="mt-3">
            <Col>
              <Form.Group controlId="formSpeak">
                <Form.Label>Speak</Form.Label>
                <Form.Control
                  as="select"
                  name="speak_id"
                  value={formData.speak_id}
                  onChange={handleChange}
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

            <Col>
              <Form.Group controlId="formRead">
                <Form.Label>Read</Form.Label>
                <Form.Control
                  as="select"
                  name="read_id"
                  value={formData.read_id}
                  onChange={handleChange}
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

            <Col>
              <Form.Group controlId="formWrite">
                <Form.Label>Write</Form.Label>
                <Form.Control
                  as="select"
                  name="write_id"
                  value={formData.write_id}
                  onChange={handleChange}
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
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LanguageProficiencyModal;
