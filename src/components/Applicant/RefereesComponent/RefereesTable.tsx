"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";
import { RefereeData } from "./RefereesComponent";

interface Props {
  referees: RefereeData[];
  onEdit: (referee: RefereeData & { id: number }) => void;
  onDelete: (id: number) => void;
}

const RefereesTable: React.FC<Props> = ({ referees, onEdit, onDelete }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Institution</th>
          <th>Position</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {referees.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center">No referees found</td>
          </tr>
        ) : (
          referees.map(r => (
            <tr key={r.id}>
              <td>{r.first_name} {r.last_name}</td>
              <td>{r.institution}</td>
              <td>{r.referee_position}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => onEdit(r)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => onDelete(r.id!)}>Delete</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default RefereesTable;
