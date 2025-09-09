"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import RefereesTable from "./RefereesTable";
import AddRefereeModal from "./AddRefereeModal";

export interface RefereeData {
  id?: number;
  first_name: string;
  last_name: string;
  institution: string;
  email: string;
  phone: string;
  referee_position: string;
}

const RefereesComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const [referees, setReferees] = useState<RefereeData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReferee, setEditingReferee] = useState<RefereeData & { id: number } | null>(null);

  const applicantId = session?.user?.applicantId?.toString() || null;

  // Fetch referees
  const fetchReferees = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/referees/${applicantId}`);
      const data = await res.json();
      setReferees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching referees:", err);
      setReferees([]);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchReferees();
    }
  }, [applicantId, status]);

  // Save referee (POST or PUT)
  const handleSave = async (data: RefereeData) => {
    if (!applicantId) return;

    try {
      const url = editingReferee
        ? `/api/applicant/referees/${applicantId}?id=${editingReferee.id}`
        : `/api/applicant/referees/${applicantId}`;
      const method = editingReferee ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, applicant_id: applicantId }),
      });

      await fetchReferees();
      setShowModal(false);
      setEditingReferee(null);
    } catch (err) {
      console.error("Error saving referee:", err);
    }
  };

  // Edit referee
  const handleEdit = (referee: RefereeData & { id: number }) => {
    setEditingReferee(referee);
    setShowModal(true);
  };

  // Delete referee
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this referee?")) return;
    try {
      await fetch(`/api/applicant/referees/${applicantId}?id=${id}`, { method: "DELETE" });
      await fetchReferees();
    } catch (err) {
      console.error("Error deleting referee:", err);
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage referees.</div>;

  return (
    <>
      <Card className="mt-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Referees</h5>
          <Button variant="light" onClick={() => setShowModal(true)}>
            Add Referee
          </Button>
        </Card.Header>
        <Card.Body>
          <RefereesTable referees={referees} onEdit={handleEdit} onDelete={handleDelete} />
        </Card.Body>
      </Card>

      <AddRefereeModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingReferee(null);
        }}
        onSave={handleSave}
        editingReferee={editingReferee}
      />
    </>
  );
};

export default RefereesComponent;
