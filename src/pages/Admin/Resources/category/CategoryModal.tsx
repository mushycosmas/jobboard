"use client";

import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

export interface Category {
  id?: number;
  name: string;
}

interface Props {
  show: boolean;
  onHide: () => void;
  category: Category;
  setCategory: (c: Category) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CategoryModal: React.FC<Props> = ({ show, onHide, category, setCategory, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{category.id ? "Edit Category" : "Add New Category"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={category.name || ""}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {category.id ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryModal;
