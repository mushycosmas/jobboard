import React from "react";
import { Button, Table } from "react-bootstrap";
import { PositionLevel } from "./PositionLevelService";

interface Props {
  positionLevels: PositionLevel[];
  onEdit: (level: PositionLevel) => void;
  onDelete: (id: number) => void;
}

const PositionLevelTable: React.FC<Props> = ({ positionLevels, onEdit, onDelete }) => {
  return (
    <Table bordered hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th style={{ width: "10%" }}>#</th>
          <th style={{ width: "70%" }}>Position Name</th>
          <th style={{ width: "20%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {positionLevels.length > 0 ? (
          positionLevels.map((level, index) => (
            <tr key={level.id || index}>
              <td>{level.id}</td>
              <td>{level.position_name}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(level)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => level.id && onDelete(level.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-muted">
              No position levels found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default PositionLevelTable;
