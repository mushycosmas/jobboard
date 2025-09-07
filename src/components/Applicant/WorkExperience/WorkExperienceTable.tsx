import React from "react";
import { Table, Button } from "react-bootstrap";
import { WorkExperienceData } from "./WorkExperience";

interface Props {
  experiences: WorkExperienceData[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const WorkExperienceTable: React.FC<Props> = ({ experiences, onEdit, onDelete }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Institution</th>
          <th>Position</th>
          <th>From</th>
          <th>To</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.institution}</td>
              <td>{exp.position}</td>
              <td>{exp.from}</td>
              <td>{exp.to}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => onEdit(exp.id)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => onDelete(exp.id)}>Delete</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center">
              No work experience added yet.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default WorkExperienceTable;
