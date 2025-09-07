"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";

interface ProfessionalQualification {
  id: number;
  country?: string;
  institution?: string;
  course?: string;
  attachment?: string;
  started?: string;
  ended?: string;
}

interface Props {
  qualifications: ProfessionalQualification[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProfessionalTable: React.FC<Props> = ({ qualifications, onEdit, onDelete }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Country</th>
          <th>Institution</th>
          <th>Course</th>
          <th>Attachment</th>
          <th>Started</th>
          <th>Ended</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {qualifications.length ? (
          qualifications.map((q) => (
            <tr key={q.id}>
              <td>{q.country}</td>
              <td>{q.institution}</td>
              <td>{q.course}</td>
              <td>{q.attachment || "No Attachment"}</td>
              <td>{q.started ? new Date(q.started).toLocaleDateString() : ""}</td>
              <td>{q.ended ? new Date(q.ended).toLocaleDateString() : ""}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => onEdit(q.id)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => onDelete(q.id)}>Delete</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center">No qualifications added yet.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ProfessionalTable;
