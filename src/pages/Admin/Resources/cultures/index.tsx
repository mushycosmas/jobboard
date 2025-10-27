"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  Culture,
  getCultures,
  addCulture,
  updateCulture,
  deleteCulture,
} from "./CultureService";
import CultureTable from "./CultureTable";
import CultureModal from "./CultureModal";

const CultureIndex: React.FC = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCulture, setCurrentCulture] = useState<Culture>({
    id: undefined,
    name: "",
    description: "",
  });

  const loadCultures = async () => {
    setLoading(true);
    try {
      const data = await getCultures();
      setCultures(data);
    } catch (err) {
      console.error("Failed to fetch cultures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCultures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: currentCulture.name.trim(),
      description: currentCulture.description?.trim() || "",
    };
    if (!payload.name) {
      alert("Culture name is required.");
      return;
    }
    try {
      if (currentCulture.id) {
        await updateCulture(currentCulture.id, payload);
      } else {
        await addCulture(payload);
      }
      setShowModal(false);
      setCurrentCulture({ id: undefined, name: "", description: "" });
      loadCultures();
    } catch (err) {
      console.error("Error saving culture:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this culture?")) return;
    try {
      await deleteCulture(id);
      loadCultures();
    } catch (err) {
      console.error("Error deleting culture:", err);
    }
  };

  const handleEdit = (culture: Culture) => {
    setCurrentCulture({ ...culture });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentCulture({ id: undefined, name: "", description: "" });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Manage Cultures</h4>
            <Button variant="success" onClick={handleAddNew}>
              Add Culture
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <CultureTable
                cultures={cultures}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          )}
        </Card>

        <CultureModal
          show={showModal}
          onHide={() => setShowModal(false)}
          culture={currentCulture}
          setCulture={setCurrentCulture}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default CultureIndex;
