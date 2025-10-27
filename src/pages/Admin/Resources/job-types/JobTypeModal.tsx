"use client";
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { JobType } from "./JobTypeService";

interface Props {
  show: boolean;
  onHide: () => void;
  jobType: JobType;
  setJobType: (jt: JobType) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const JobTypeModal: React.FC<Props> = ({ show, onHide, jobType, setJobType, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{jobType.id ? "Edit Job Type" : "Add Job Type"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Job Type Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter job type"
              value={jobType.name || ""}
              onChange={(e) => setJobType({ ...jobType, name: e.target.value })}
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {jobType.id ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default JobTypeModal;
