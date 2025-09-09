"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";

export interface SkillData {
  id: number;
  skill_name: string;
}

interface Props {
  skills: SkillData[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SkillsTable: React.FC<Props> = ({ skills, onEdit, onDelete }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Skill Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {skills.length > 0 ? (
          skills.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.skill_name}</td>
              <td>
                {/* <Button variant="warning" size="sm" onClick={() => onEdit(skill.id)}>Edit</Button>{" "} */}
                <Button variant="danger" size="sm" onClick={() => onDelete(skill.id)}>Delete</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="text-center">No skills found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default SkillsTable;
