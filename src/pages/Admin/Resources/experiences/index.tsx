"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  Experience,
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from "./ExperienceService";
import ExperienceModal from "./ExperienceModal";
import ExperienceTable from "./ExperienceTable";

const ExperienceIndex: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentExp, setCurrentExp] = useState<Experience>({
    id: undefined,
    name: "",
    years_min: null,
    years_max: null,
  });

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExp.name.trim()) {
      alert("Experience name is required.");
      return;
    }

    try {
      if (currentExp.id) await updateExperience(currentExp.id, currentExp);
      else await addExperience(currentExp);

      setShowModal(false);
      setCurrentExp({ id: undefined, name: "", years_min: null, years_max: null });
      loadExperiences();
    } catch (err) {
      console.error("Error saving experience:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      loadExperiences();
    } catch (err) {
      console.error("Error deleting experience:", err);
    }
  };

  const handleEdit = (exp: Experience) => {
    setCurrentExp(exp);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentExp({ id: undefined, name: "", years_min: null, years_max: null });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Manage Experiences</h4>
            <Button variant="success" onClick={handleAddNew}>
              Add Experience
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <ExperienceTable
                experiences={experiences}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          )}
        </Card>

        <ExperienceModal
          show={showModal}
          onHide={() => setShowModal(false)}
          experience={currentExp}
          setExperience={setCurrentExp}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default ExperienceIndex;
