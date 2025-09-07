"use client";

import React, { useContext } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { UniversalDataContext } from "@/context/UniversalDataContext";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  formData: any;
  setFormData: (data: any) => void;
}

const formatDate = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const ProfessionalFormModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  formData,
  setFormData,
}) => {
  const { institutions, courses, countries } = useContext(UniversalDataContext);

  // Handle normal input/select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle CreatableSelect changes (institution & course)
  const handleCreatableChange = (name: string, option: any) => {
    setFormData({
      ...formData,
      [name]: option ? Number(option.value) : "", // always number
    });
  };

  // Handle file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachment: e.target.files[0] });
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country_id || !formData.institution_id || !formData.course_id) {
      alert("Country, Institution, and Course are required.");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {formData.id ? "Edit Professional Qualification" : "Add Professional Qualification"}
        </Modal.Title>
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
                  value={formData.country_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                  onChange={(option) => handleCreatableChange("institution_id", option)}
                  value={
                    formData.institution_id
                      ? {
                          label:
                            institutions.find((i: any) => i.id === Number(formData.institution_id))
                              ?.name || formData.institution_id,
                          value: Number(formData.institution_id),
                        }
                      : null
                  }
                  options={institutions.map((i: any) => ({ label: i.name, value: i.id }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="course">
                <Form.Label>Course</Form.Label>
                <CreatableSelect
                  isClearable
                  onChange={(option) => handleCreatableChange("course_id", option)}
                  value={
                    formData.course_id
                      ? {
                          label: courses.find((c: any) => c.id === Number(formData.course_id))?.name ||
                            formData.course_id,
                          value: Number(formData.course_id),
                        }
                      : null
                  }
                  options={courses.map((c: any) => ({ label: c.name, value: c.id }))}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="started">
                <Form.Label>Started</Form.Label>
                <Form.Control
                  type="date"
                  name="started"
                  value={formatDate(formData.started)}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="ended">
                <Form.Label>Ended</Form.Label>
                <Form.Control
                  type="date"
                  name="ended"
                  value={formatDate(formData.ended)}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="attachment" className="mt-3">
            <Form.Label>Attachment</Form.Label>
            <Form.Control type="file" name="attachment" onChange={handleFileChange} />
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfessionalFormModal;
