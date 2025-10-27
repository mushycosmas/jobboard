import React from "react";
import { Table, Button } from "react-bootstrap";
import { Skill } from "./SkillService";

interface Props {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
}

const SkillTable: React.FC<Props> = ({ skills, onEdit, onDelete }) => {
  return (
    <Table bordered hover responsive>
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Skill Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <tr key={skill.id}>
              <td>{index + 1}</td>
              <td>{skill.skill_name}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(skill)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(skill.id!)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-muted">
              No skills found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default SkillTable;
