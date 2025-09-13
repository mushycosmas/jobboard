"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { JobApplicationData } from "./JobApplicationsComponent";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: JobApplicationData) => void;
  editingApplication: (JobApplicationData & { id: number }) | null;
}

const AddJobApplicationModal: React.FC<Props> = ({ show, onClose, onSave, editingApplication }) => {
  const [formData, setFormData] = useState<JobApplicationData>({
    job_title: "",
    company_name: "",
    status: "Pending",
    applied_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editingApplication) {
      setFormData(editingApplication);
    } else {
      setFormData({
        job_title: "",
        company_name: "",
        status: "Pending",
        applied_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingApplication]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingApplication ? "Edit Job Application" : "Add Job Application"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="jobTitle" className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />
          </Form.Group>

          <Form.Group controlId="companyName" className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </Form.Group>

          <Form.Group controlId="status" className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="appliedDate" className="mb-3">
            <Form.Label>Applied Date</Form.Label>
            <Form.Control
              type="date"
              name="applied_date"
              value={formData.applied_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {editingApplication ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddJobApplicationModal;
