"use client";

import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { Qualification, OptionType } from "./types";
import { UniversalDataContext } from "@/context/UniversalDataContext";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (qualification: Qualification) => void;
  qualification?: Qualification | null;
  applicant_id: string;
}

const QualificationFormModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  qualification,
  applicant_id,
}) => {
  const { educationLevels, categories, programmes, institutions, countries } =
    useContext(UniversalDataContext);

  const [formData, setFormData] = useState<any>({
    id: null,
    applicant_id,
    education_level_id: "",
    category_id: "",
    programme_id: "",
    institution_id: "",
    country_id: "",
    attachment: null as File | null,
    date_from: "",
    date_to: "",
  });

  useEffect(() => {
    if (qualification) {
      setFormData({
        id: qualification.id,
        applicant_id,
        education_level_id: qualification.education_level_id,
        category_id: qualification.category_id,
        programme_id: qualification.programme_id || "",
        institution_id: qualification.institution_id || "",
        country_id: qualification.country_id,
        attachment: null,
        date_from: formatDate(qualification.started),
        date_to: formatDate(qualification.ended),
      });
    } else {
      setFormData((prev: any) => ({ ...prev, applicant_id }));
    }
  }, [qualification, applicant_id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData((prev: any) => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSelectChange = (field: string, option: OptionType | null) => {
    setFormData((prev: any) => ({ ...prev, [field]: option?.value || "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload for API
    const payload: Qualification = {
      id: formData.id,
      applicant_id: Number(formData.applicant_id),
      education_level_id: Number(formData.education_level_id),
      category_id: Number(formData.category_id),
      programme_id: formData.programme_id ? Number(formData.programme_id) : null,
      institution_id: formData.institution_id ? Number(formData.institution_id) : null,
      country_id: Number(formData.country_id),
      started: formData.date_from,
      ended: formData.date_to,
      attachment: formData.attachment || null,
    };

    onSave(payload);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{qualification ? "Edit" : "Add"} Qualification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="education_level_id">
                <Form.Label>Education Level</Form.Label>
                <Form.Select
                  name="education_level_id"
                  value={formData.education_level_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Level</option>
                  {educationLevels.map((level: any) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="category_id">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="programme_id">
                <Form.Label>Programme</Form.Label>
                <CreatableSelect
                  value={
                    formData.programme_id
                      ? {
                          value: formData.programme_id,
                          label:
                            programmes.find((p: any) => p.id === formData.programme_id)?.name ||
                            formData.programme_id,
                        }
                      : null
                  }
                  onChange={(opt) => handleSelectChange("programme_id", opt)}
                  options={programmes.map((p: any) => ({ value: p.id, label: p.name }))}
                  isClearable
                  placeholder="Select or create programme"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="institution_id">
                <Form.Label>Institution</Form.Label>
                <CreatableSelect
                  value={
                    formData.institution_id
                      ? {
                          value: formData.institution_id,
                          label:
                            institutions.find((i: any) => i.id === formData.institution_id)?.name ||
                            formData.institution_id,
                        }
                      : null
                  }
                  onChange={(opt) => handleSelectChange("institution_id", opt)}
                  options={institutions.map((i: any) => ({ value: i.id, label: i.name }))}
                  isClearable
                  placeholder="Select or create institution"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="country_id">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="attachment">
                <Form.Label>Attachment</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="date_from">
                <Form.Label>Date From</Form.Label>
                <Form.Control
                  type="date"
                  name="date_from"
                  value={formData.date_from}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="date_to">
                <Form.Label>Date To</Form.Label>
                <Form.Control
                  type="date"
                  name="date_to"
                  value={formData.date_to}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {qualification ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default QualificationFormModal;
