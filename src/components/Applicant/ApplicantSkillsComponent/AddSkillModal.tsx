"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";

interface AddSkillModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (selectedSkills: { value: number | string; label: string }[]) => void;
  availableSkills: { id: number | string; name: string }[];
  editingSkill?: { id?: number; skill_id?: number | string; skill_name?: string } | null;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  show,
  onClose,
  onSave,
  availableSkills,
  editingSkill = null,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<{ value: number | string; label: string }[]>([]);

  useEffect(() => {
    if (editingSkill) {
      setSelectedSkills([{ value: editingSkill.skill_id, label: editingSkill.skill_name || "" }]);
    } else {
      setSelectedSkills([]);
    }
  }, [editingSkill]);

  const skillOptions = availableSkills.map(skill => ({
    value: skill.id,
    label: skill.name,
  }));

  const handleSubmit = () => {
    if (!selectedSkills || selectedSkills.length === 0) {
      alert("Please select at least one skill");
      return;
    }
    onSave(selectedSkills);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingSkill ? "Edit Skill" : "Add Skills"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreatableSelect
          options={skillOptions}
          isMulti
          value={selectedSkills}
          onChange={(values) => setSelectedSkills(values as any)}
          placeholder="Select or create skills"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSkillModal;
