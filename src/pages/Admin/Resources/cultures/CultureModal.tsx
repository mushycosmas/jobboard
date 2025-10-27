"use client";

import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Culture } from "./CultureService";

interface Props {
  show: boolean;
  onHide: () => void;
  culture: Culture;
  setCulture: (c: Culture) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CultureModal: React.FC<Props> = ({ show, onHide, culture, setCulture, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{culture.id ? "Edit Culture" : "Add New Culture"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Culture Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter culture name"
              value={culture.name || ""}
              onChange={(e) => setCulture({ ...culture, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Optional description"
              value={culture.description || ""}
              onChange={(e) => setCulture({ ...culture, description: e.target.value })}
              rows={3}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {culture.id ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CultureModal;
