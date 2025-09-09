'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { UniversalDataContext } from '@/context/UniversalDataContext';
import WorkExperienceTable from './WorkExperienceTable';
import WorkExperienceModal from './WorkExperienceModal';
import { useSession } from "next-auth/react";

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
  is_currently_working?: boolean;
}

const WorkExperience: React.FC = () => {
  const { institutions, positions } = useContext(UniversalDataContext);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperienceData | null>(null);
  const { data: session, status } = useSession();
  const [applicantId, setApplicantId] = useState<string | null>(null);


  // Fetch all experiences
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
      if (status === "authenticated" && session?.user?.applicantId) {
        setApplicantId(session.user.applicantId.toString());
      }
    }, [session, status]);

  useEffect(() => {
    fetchWorkExperiences();
  }, [applicantId]);

  // Open modal to add new experience
  const handleAdd = () => {
    setEditingExperience(null);
    setShowModal(true);
  };

  // Open modal to edit existing experience
  const handleEdit = (id: number) => {
    const exp = workExperiences.find((e) => e.id === id);
    if (exp) {
      setEditingExperience(exp);
      setShowModal(true);
    }
  };

  // Delete experience
  const handleDelete = async (id: number) => {
    if (!applicantId) return;
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const res = await fetch(`/api/applicant/experiences/${applicantId}?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      await fetchWorkExperiences();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete experience');
    }
  };

  // Save or update experience
  const handleSave = async (data: Partial<WorkExperienceData> & { id?: number }) => {


    console.log("kelvin cosmas i'm reach here",applicantId);

    if (!applicantId) return;

    try {
      // Map frontend fields to API fields
      const payload = {
        id: data.id,
        institution_id: data.institution_id,
        position_id: data.position_id,
        from_date: data.from,
        to_date: data.to === 'Present' ? null : data.to,
        is_currently_working: data.to === 'Present',
        responsibility: data.responsibilities,
      };

      const method = data.id ? 'PUT' : 'POST';
      const url = `/api/applicant/experiences/${applicantId}`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      await fetchWorkExperiences();
      setShowModal(false);
      setEditingExperience(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save experience: ' + (err as Error).message);
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
