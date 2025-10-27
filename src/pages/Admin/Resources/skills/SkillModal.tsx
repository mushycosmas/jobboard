import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Skill } from "./SkillService";

interface Props {
  show: boolean;
  onHide: () => void;
  skill: Skill;
  setSkill: (skill: Skill) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SkillModal: React.FC<Props> = ({ show, onHide, skill, setSkill, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{skill.id ? "Edit Skill" : "Add Skill"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Skill Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter skill name"
              value={skill.skill_name}
              onChange={(e) => setSkill({ ...skill, skill_name: e.target.value })}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {skill.id ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SkillModal;
