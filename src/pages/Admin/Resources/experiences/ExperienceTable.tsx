import React from "react";
import { Button, Table } from "react-bootstrap";
import { Experience } from "./ExperienceService";

interface Props {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (id: number) => void;
}

const ExperienceTable: React.FC<Props> = ({ experiences, onEdit, onDelete }) => {
  return (
    <Table bordered hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Experience Name</th>
          <th>Years (Min–Max)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {experiences.length > 0 ? (
          experiences.map((exp, index) => (
            <tr key={exp.id || index}>
              <td>{index + 1}</td>
              <td>{exp.name}</td>
              <td>
                {exp.years_min ?? "–"} - {exp.years_max ?? "–"}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(exp)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => exp.id && onDelete(exp.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center text-muted">
              No experiences found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ExperienceTable;
