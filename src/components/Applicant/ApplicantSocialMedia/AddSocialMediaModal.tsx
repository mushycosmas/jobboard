"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";

interface AddSocialMediaModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (socialMediaId: number | string, url: string) => void;
  availableSocialMedia?: { id: number | string; name: string }[];
  editingLink?: { id?: number; social_media_id?: number | string; social_media_name?: string; url?: string } | null;
}

const AddSocialMediaModal: React.FC<AddSocialMediaModalProps> = ({
  show,
  onClose,
  onSave,
  availableSocialMedia = [],
  editingLink = null,
}) => {
  const [selectedOption, setSelectedOption] = useState<{ value: number | string; label: string } | null>(null);
  const [url, setUrl] = useState("");

  // Memoize options so they don't change on every render
  const socialOptions = useMemo(() => {
    return availableSocialMedia.map(s => ({ value: s.id, label: s.name }));
  }, [availableSocialMedia]);

  // Pre-fill when editing
  useEffect(() => {
    if (editingLink) {
      setUrl(editingLink.url || "");
      const preSelected = socialOptions.find(opt => opt.value === editingLink.social_media_id) || null;
      setSelectedOption(preSelected);
    } else {
      setSelectedOption(null);
      setUrl("");
    }
  }, [editingLink, socialOptions]);

  const handleSubmit = () => {
    if (!selectedOption || !url) {
      alert("Please select a social media and provide a URL.");
      return;
    }
    onSave(selectedOption.value, url);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingLink ? "Edit Social Media" : "Add Social Media"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Select Social Media</Form.Label>
          <Select
            options={socialOptions}
            value={selectedOption}
            onChange={opt => setSelectedOption(opt as any)}
            placeholder="Choose social media"
            isClearable
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Profile URL</Form.Label>
          <Form.Control
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter your profile link"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSocialMediaModal;
