import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Experience } from "./ExperienceService";

interface Props {
  show: boolean;
  onHide: () => void;
  experience: Experience;
  setExperience: React.Dispatch<React.SetStateAction<Experience>>;
  onSubmit: (e: React.FormEvent) => void;
}

const ExperienceModal: React.FC<Props> = ({
  show,
  onHide,
  experience,
  setExperience,
  onSubmit,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{experience.id ? "Edit Experience" : "Add Experience"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Experience Name</Form.Label>
            <Form.Control
              type="text"
              value={experience.name}
              onChange={(e) =>
                setExperience((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Mid Level"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Minimum Years</Form.Label>
            <Form.Control
              type="number"
              value={experience.years_min || ""}
              onChange={(e) =>
                setExperience((prev) => ({ ...prev, years_min: Number(e.target.value) }))
              }
              placeholder="e.g., 2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Maximum Years</Form.Label>
            <Form.Control
              type="number"
              value={experience.years_max || ""}
              onChange={(e) =>
                setExperience((prev) => ({ ...prev, years_max: Number(e.target.value) }))
              }
              placeholder="e.g., 5"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            {experience.id ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExperienceModal;
