'use client';

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { WorkExperienceData } from "./WorkExperience";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: WorkExperienceData) => void;
  experience: WorkExperienceData | null;
  institutions: { id: number; name: string }[];
  positions: { id: number; name: string }[];
}

const CHAR_LIMIT = 500;
const MIN_CHAR_LIMIT = 300;

const WorkExperienceModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  experience,
  institutions,
  positions,
}) => {
  // Controlled form data
  const [formData, setFormData] = useState<WorkExperienceData>({
    id: experience?.id || 0,
    applicant_id: experience?.applicant_id || 0,
    institution_id: experience?.institution_id || "",
    position_id: experience?.position_id || "",
    from: experience?.from || "",
    to: experience?.to === "Present" ? "" : experience?.to || "",
    responsibilities: experience?.responsibilities || "",
    institution: experience?.institution || "",
    position: experience?.position || "",
  });

  // Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.responsibilities,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, responsibilities: editor.getHTML() }));
    },
  });

  // Update state when editing an existing experience
  useEffect(() => {
    if (experience) {
      setFormData({
        id: experience.id,
        applicant_id: experience.applicant_id,
        institution_id: experience.institution_id,
        position_id: experience.position_id,
        from: experience.from,
        to: experience.to === "Present" ? "" : experience.to,
        responsibilities: experience.responsibilities,
        institution: experience.institution || "",
        position: experience.position || "",
      });
      if (editor) editor.commands.setContent(experience.responsibilities || "");
    } else {
      setFormData({
        id: 0,
        applicant_id: 0,
        institution_id: "",
        position_id: "",
        from: "",
        to: "",
        responsibilities: "",
        institution: "",
        position: "",
      });
      if (editor) editor.commands.clearContent();
    }
  }, [experience, editor]);

  const handleSave = () => {
    const plainText = editor?.getText() || "";

    if (
      !formData.institution_id ||
      !formData.position_id ||
      !formData.from ||
      !formData.responsibilities ||
      plainText.length < MIN_CHAR_LIMIT
    ) {
      alert(
        `Fill all required fields. Responsibilities must be at least ${MIN_CHAR_LIMIT} characters.`
      );
      return;
    }

    onSave({ ...formData });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {experience ? "Edit Work Experience" : "Add Work Experience"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Institution */}
          <Form.Group>
            <Form.Label>Institution</Form.Label>
            <CreatableSelect
              options={institutions.map((i) => ({ value: i.id, label: i.name }))}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  institution_id: opt?.value ?? opt?.label,
                }))
              }
              value={
                formData.institution_id
                  ? {
                      value: formData.institution_id,
                      label:
                        institutions.find((i) => i.id === formData.institution_id)
                          ?.name || String(formData.institution_id),
                    }
                  : null
              }
            />
          </Form.Group>

          {/* Position */}
          <Form.Group className="mt-3">
            <Form.Label>Position</Form.Label>
            <CreatableSelect
              options={positions.map((p) => ({ value: p.id, label: p.name }))}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  position_id: opt?.value ?? opt?.label,
                }))
              }
              value={
                formData.position_id
                  ? {
                      value: formData.position_id,
                      label:
                        positions.find((p) => p.id === formData.position_id)
                          ?.name || String(formData.position_id),
                    }
                  : null
              }
            />
          </Form.Group>

          {/* Dates */}
          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.from}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, from: e.target.value }))
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.to}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, to: e.target.value }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Responsibilities */}
          <Form.Group className="mt-3">
            <Form.Label>Responsibilities</Form.Label>
            <div className="border rounded p-2" style={{ minHeight: "150px" }}>
              <EditorContent editor={editor} />
            </div>
            <small>
              {editor?.getText().length || 0}/{CHAR_LIMIT} characters
            </small>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {experience ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkExperienceModal;
