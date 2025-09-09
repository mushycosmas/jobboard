"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { UniversalDataContext } from "@/context/UniversalDataContext";
import LanguageProficiencyTable from "./LanguageProficiencyTable";
import LanguageProficiencyModal from "./LanguageProficiencyModal";

export interface LanguageData {
  id?: number;
  applicant_id?: string;
  language_id: string;
  speak_id: string;
  read_id: string;
  write_id: string;
  name?: string;
  speaking_skill?: string;
  reading_skill?: string;
  writing_skill?: string;
}

const API_BASE_URL = "/api/applicant/language-profiency";

const LanguageProficiency: React.FC = () => {
  const { languages, languageRead, languageSpeak, languageWrite } = useContext(UniversalDataContext);
  const { data: session, status } = useSession();

  const [savedLanguages, setSavedLanguages] = useState<LanguageData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageData | null>(null);
  const [applicantId, setApplicantId] = useState<string>("");

  // Set applicantId from session
  useEffect(() => {
    if (status === "authenticated" && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    }
  }, [session, status]);

  // Fetch all languages
  const fetchLanguages = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${applicantId}`);
      if (!res.ok) throw new Error("Failed to fetch languages");
      const data = await res.json();
      setSavedLanguages(data);
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  useEffect(() => {
    if (applicantId) fetchLanguages();
  }, [applicantId]);

  // Open modal for adding new language
  const handleAdd = () => {
    setEditingLanguage(null);
    setShowModal(true);
  };

  // Open modal for editing a language
  const handleEdit = (id: number) => {
    const lang = savedLanguages.find(l => l.id === id);
    if (!lang) return;
    setEditingLanguage(lang);
    setShowModal(true);
  };

  // Delete a language
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this language?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${applicantId}?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete language");

      await fetchLanguages();
    } catch (err) {
      console.error("Error deleting language:", err);
      alert("Failed to delete language.");
    }
  };

  // Save (create or update) language
  const handleSave = async (data: LanguageData) => {
    if (!applicantId) return;

    try {
      const url = `${API_BASE_URL}/${applicantId}`;
      const method = editingLanguage ? "PUT" : "POST";

      const payload = editingLanguage ? { ...data, id: editingLanguage.id } : data;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save language");

      await fetchLanguages();
      setShowModal(false);
      setEditingLanguage(null);
    } catch (err) {
      console.error("Error saving language:", err);
      alert("Failed to save language.");
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage your languages.</div>;

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">Language Proficiency</h5>
        <Button variant="light" onClick={handleAdd}>Add Language</Button>
      </Card.Header>
      <Card.Body>
        <LanguageProficiencyTable
          languages={savedLanguages}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card.Body>

      <LanguageProficiencyModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingLanguage={editingLanguage}
        languages={languages}
        languageSpeak={languageSpeak}
        languageRead={languageRead}
        languageWrite={languageWrite}
      />
    </Card>
  );
};

export default LanguageProficiency;
