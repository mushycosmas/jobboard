'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { UniversalDataContext } from '@/context/UniversalDataContext';
import WorkExperienceTable from './WorkExperienceTable';
import WorkExperienceModal from './WorkExperienceModal';

export interface WorkExperienceData {
  id: number;
  applicant_id: number;
  institution_id: number | string;
  position_id: number | string;
  from: string;
  to: string | 'Present';
  responsibilities: string;
  institution?: string;
  position?: string;
}

const WorkExperience: React.FC = () => {
  const { institutions, positions } = useContext(UniversalDataContext);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperienceData | null>(null);

  const applicantId = typeof window !== 'undefined' ? localStorage.getItem('applicantId') : null;

  const fetchWorkExperiences = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/experiences/${applicantId}`);
      if (!res.ok) throw new Error('Failed to fetch work experiences');
      const data = await res.json();
      setWorkExperiences(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkExperiences();
  }, [applicantId]);

  const handleAdd = () => {
    setEditingExperience(null);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const exp = workExperiences.find((e) => e.id === id);
    if (exp) {
      setEditingExperience(exp);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      const res = await fetch(`/api/applicant/experiences/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      await fetchWorkExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (data: Partial<WorkExperienceData> & { id?: number }) => {
    if (!applicantId) return;
    try {
      const url = data.id
        ? `/api/applicant/experiences/${data.id}` // update
        : `/api/applicant/experiences/${applicantId}`; // create
      const method = data.id ? 'PUT' : 'POST';
      const payload = { ...data, applicant_id: Number(applicantId) };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save experience');

      await fetchWorkExperiences();
      setShowModal(false);
      setEditingExperience(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save experience');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Work Experience</h5>
          <Button variant="light" onClick={handleAdd}>
            + Add Entry
          </Button>
        </Card.Header>
        <Card.Body>
          <WorkExperienceTable
            experiences={workExperiences}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card.Body>
      </Card>

      <WorkExperienceModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        experience={editingExperience}
        institutions={institutions}
        positions={positions}
      />
    </Container>
  );
};

export default WorkExperience;
