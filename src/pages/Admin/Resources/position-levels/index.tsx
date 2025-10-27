"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  PositionLevel,
  getPositionLevels,
  addPositionLevel,
  updatePositionLevel,
  deletePositionLevel,
} from "./PositionLevelService"; // ✅ similar to CategoryService
import PositionLevelTable from "./PositionLevelTable"; // ✅ similar to CategoryTable
import PositionLevelModal from "./PositionLevelModal"; // ✅ similar to CategoryModal

const PositionLevelIndex: React.FC = () => {
  const [positionLevels, setPositionLevels] = useState<PositionLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<PositionLevel>({
    id: undefined,
    position_name: "",
  });

  // Load all position levels
  const loadPositionLevels = async () => {
    setLoading(true);
    try {
      const data = await getPositionLevels();
      setPositionLevels(data);
    } catch (err) {
      console.error("Failed to fetch position levels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPositionLevels();
  }, []);

  // Handle add/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      position_name: currentPosition.position_name?.trim(),
    };

    if (!payload.position_name) {
      alert("Position name is required.");
      return;
    }

    try {
      if (currentPosition.id) {
        await updatePositionLevel(currentPosition.id, payload);
      } else {
        await addPositionLevel(payload);
      }

      setShowModal(false);
      setCurrentPosition({ id: undefined, position_name: "" });
      loadPositionLevels();
    } catch (err) {
      console.error("Error saving position level:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this position level?")) return;

    try {
      await deletePositionLevel(id);
      loadPositionLevels();
    } catch (err) {
      console.error("Error deleting position level:", err);
    }
  };

  // Edit position level
  const handleEdit = (position: PositionLevel) => {
    setCurrentPosition({
      id: position.id,
      position_name: position.position_name || "",
    });
    setShowModal(true);
  };

  // Add new position level
  const handleAddNew = () => {
    setCurrentPosition({ id: undefined, position_name: "" });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Manage Position Levels</h4>
            <Button variant="success" onClick={handleAddNew}>
              Add Position Level
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <PositionLevelTable
                positionLevels={positionLevels}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          )}
        </Card>

        <PositionLevelModal
          show={showModal}
          onHide={() => setShowModal(false)}
          positionLevel={currentPosition}
          setPositionLevel={setCurrentPosition}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default PositionLevelIndex;
