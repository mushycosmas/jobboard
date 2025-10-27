"use client";

import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

export interface PositionLevel {
  id?: number;
  position_name: string;
}

interface Props {
  show: boolean;
  onHide: () => void;
  positionLevel: PositionLevel;
  setPositionLevel: (c: PositionLevel) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PositionLevelModal: React.FC<Props> = ({
  show,
  onHide,
  positionLevel,
  setPositionLevel,
  onSubmit,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {positionLevel.id ? "Edit Position Level" : "Add New Position Level"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Position Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter position name"
              value={positionLevel.position_name || ""}
              onChange={(e) =>
                setPositionLevel({ ...positionLevel, position_name: e.target.value })
              }
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {positionLevel.id ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PositionLevelModal;
