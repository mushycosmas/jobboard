import React from "react";
import { Button, Table } from "react-bootstrap";
import { JobType } from "./JobTypeService";

interface Props {
  jobTypes: JobType[];
  onEdit: (jt: JobType) => void;
  onDelete: (id: number) => void;
}

const JobTypeTable: React.FC<Props> = ({ jobTypes, onEdit, onDelete }) => {
  return (
    <Table bordered hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th style={{ width: "10%" }}>#</th>
          <th style={{ width: "70%" }}>Job Type Name</th>
          <th style={{ width: "20%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobTypes.length > 0 ? (
          jobTypes.map((jt, idx) => (
            <tr key={jt.id || idx}>
              <td>{jt.id}</td>
              <td>{jt.name}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(jt)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => jt.id && onDelete(jt.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-muted">
              No job types found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default JobTypeTable;
