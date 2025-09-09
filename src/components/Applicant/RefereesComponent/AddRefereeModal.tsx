"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { RefereeData } from "./RefereesComponent";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: RefereeData) => void;
  editingReferee?: RefereeData & { id: number } | null;
}

const AddRefereeModal: React.FC<Props> = ({ show, onClose, onSave, editingReferee }) => {
  const [formData, setFormData] = useState<RefereeData>({
    first_name: "",
    last_name: "",
    institution: "",
    email: "",
    phone: "",
    referee_position: "",
  });

  useEffect(() => {
    if (editingReferee) {
      setFormData(editingReferee);
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        institution: "",
        email: "",
        phone: "",
        referee_position: "",
      });
    }
  }, [editingReferee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.first_name || !formData.last_name) {
      alert("First Name and Last Name are required.");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingReferee ? "Edit Referee" : "Add Referee"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {["first_name", "last_name", "institution", "referee_position", "email", "phone"].map(field => (
            <Form.Group className="mb-2" controlId={`form${field}`} key={field}>
              <Form.Label>{field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</Form.Label>
              <Form.Control
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                required={field === "first_name" || field === "last_name"}
                type={field === "email" ? "email" : "text"}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>{editingReferee ? "Update" : "Save"}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRefereeModal;
