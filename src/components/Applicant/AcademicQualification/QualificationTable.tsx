"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";
import { Qualification } from "./types";

interface Props {
  qualifications: Qualification[];
  categories: any[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const QualificationTable: React.FC<Props> = ({ qualifications, categories, onEdit, onDelete }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Level</th>
          <th>Category</th>
          <th>Programme</th>
          <th>Institution</th>
          <th>Country</th>
          <th>Date From</th>
          <th>Date To</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {qualifications.length ? (
          qualifications.map((q) => (
            <tr key={q.id}>
              <td>{q.education_level}</td>
              <td>{categories.find((c) => c.id === q.category_id)?.name || q.category_id}</td>
              <td>{q.programme}</td>
              <td>{q.institution}</td>
              <td>{q.country}</td>
              <td>{new Date(q.started).toLocaleDateString()}</td>
              <td>{new Date(q.ended).toLocaleDateString()}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(q.id)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(q.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center">
              No qualifications added yet.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default QualificationTable;
