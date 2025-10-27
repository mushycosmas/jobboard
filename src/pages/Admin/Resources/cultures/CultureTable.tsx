import React from "react";
import { Button, Table } from "react-bootstrap";
import { Culture } from "./CultureService";

interface Props {
  cultures: Culture[];
  onEdit: (culture: Culture) => void;
  onDelete: (id: number) => void;
}

const CultureTable: React.FC<Props> = ({ cultures, onEdit, onDelete }) => {
  return (
    <Table bordered hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th style={{ width: "10%" }}>#</th>
          <th style={{ width: "40%" }}>Culture Name</th>
          <th style={{ width: "40%" }}>Description</th>
          <th style={{ width: "10%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {cultures.length > 0 ? (
          cultures.map((culture, index) => (
            <tr key={culture.id || index}>
              <td>{culture.id}</td>
              <td>{culture.name}</td>
              <td>{culture.description || "-"}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(culture)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => culture.id && onDelete(culture.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center text-muted">
              No cultures found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CultureTable;
