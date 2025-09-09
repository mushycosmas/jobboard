"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { UniversalDataContext } from "@/context/UniversalDataContext";
import SkillsTable from "./SkillsTable";
import AddSkillModal from "./AddSkillModal";

export interface SkillData {
  id?: number;
  skill_id?: number | string;
  applicant_id?: string;
  skill_name?: string;
}

const API_BASE_URL = "/api/applicant/skill";

const ApplicantSkillsComponent: React.FC = () => {
  const { skills: availableSkills } = useContext(UniversalDataContext);
  const { data: session, status } = useSession();

  const [savedSkills, setSavedSkills] = useState<SkillData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [applicantId, setApplicantId] = useState<string>("");

  // Set applicantId from session
  useEffect(() => {
    if (status === "authenticated" && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    }
  }, [session, status]);

  // Fetch all skills
  const fetchSkills = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${applicantId}`);
      if (!res.ok) throw new Error("Failed to fetch skills");
      const data = await res.json();
      setSavedSkills(data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  useEffect(() => {
    if (applicantId) fetchSkills();
  }, [applicantId]);

  const handleAdd = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const skill = savedSkills.find(s => s.id === id);
    if (!skill) return;
    setEditingSkill(skill);
    setShowModal(true);
  };

const handleDelete = async (id: number) => {
  if (!applicantId) {
    alert("Applicant ID not available. Please wait.");
    return;
  }

  if (!confirm("Are you sure you want to delete this skill?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/${applicantId}?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete skill");
    }

    await fetchSkills();
  } catch (err) {
    console.error("Error deleting skill:", err);
    alert("Failed to delete skill: " + (err as Error).message);
  }
};

  // Save (create or update) skill
  const handleSave = async (selectedSkills: { value: number | string; label: string }[]) => {
    if (!applicantId) return;
    if (!selectedSkills || selectedSkills.length === 0) return;

    try {
      const url = `${API_BASE_URL}/${applicantId}`;
      const method = "POST"; // always POST for multiple selections

      const payload = selectedSkills.map(skill => ({ skill_id: skill.value }));

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save skills");
      }

      await fetchSkills();
      setShowModal(false);
      setEditingSkill(null);
    } catch (err) {
      console.error("Error saving skills:", err);
      alert("Failed to save skills: " + (err as Error).message);
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage your skills.</div>;

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">Applicant Skills</h5>
        <Button variant="light" onClick={handleAdd}>Add Skill</Button>
      </Card.Header>
      <Card.Body>
        <SkillsTable skills={savedSkills} onEdit={handleEdit} onDelete={handleDelete} />
      </Card.Body>

      <AddSkillModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave} // pass handleSave here
        availableSkills={availableSkills}
        editingSkill={editingSkill}
      />
    </Card>
  );
};

export default ApplicantSkillsComponent;
