"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Form } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import { Skill, getSkills, addSkill, updateSkill, deleteSkill } from "./SkillService";
import DataTable from "react-data-table-component";
import SkillModal from "./SkillModal";

const SkillIndex: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ id: undefined, skill_name: "" });
  const [searchText, setSearchText] = useState("");

  // Fetch skills
  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
      setFilteredSkills(data);
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Filter skills by search
  useEffect(() => {
    if (!searchText) setFilteredSkills(skills);
    else {
      const lower = searchText.toLowerCase();
      setFilteredSkills(
        skills.filter(skill => skill.skill_name.toLowerCase().includes(lower))
      );
    }
  }, [searchText, skills]);

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

  const columns = [
    {
      name: "Skill Name",
      selector: (row: Skill) => row.skill_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Skill) => (
        <>
          <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id!)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

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
              <Form.Control
                type="text"
                placeholder="Search skills..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mb-3"
              />

              <DataTable
                columns={columns}
                data={filteredSkills}
                pagination
                highlightOnHover
                striped
                responsive
              />
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
