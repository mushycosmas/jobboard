
"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import { Skill, getSkills, addSkill, updateSkill, deleteSkill } from "./SkillService";
import SkillTable from "./SkillTable";
import SkillModal from "./SkillModal";

const SkillIndex: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ id: undefined, skill_name: "" });

  // Fetch skills
  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Submit (Add / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSkill.skill_name?.trim()) {
      alert("Skill name is required");
      return;
    }

    try {
      if (currentSkill.id) {
        await updateSkill(currentSkill.id, { skill_name: currentSkill.skill_name });
      } else {
        await addSkill({ skill_name: currentSkill.skill_name });
      }
      setShowModal(false);
      setCurrentSkill({ id: undefined, skill_name: "" });
      loadSkills();
    } catch (err) {
      console.error("Failed to save skill:", err);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      loadSkills();
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  // Edit
  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setShowModal(true);
  };

  // Add new
  const handleAddNew = () => {
    setCurrentSkill({ id: undefined, skill_name: "" });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Manage Skills</h4>
            <Button variant="success" onClick={handleAddNew}>
              Add Skill
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <SkillTable skills={skills} onEdit={handleEdit} onDelete={handleDelete} />
            </Card.Body>
          )}
        </Card>

        <SkillModal
          show={showModal}
          onHide={() => setShowModal(false)}
          skill={currentSkill}
          setSkill={setCurrentSkill}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default SkillIndex;
