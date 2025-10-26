import React from "react";
import { Table, Button } from "react-bootstrap";
import { Region } from "./LocationService"; // Make sure Region interface includes country_name

interface Props {
  regions: Region[];
  onEdit: (region: Region) => void;
  onDelete: (id: number) => void;
}

const RegionTable: React.FC<Props> = ({ regions, onEdit, onDelete }) => {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Region Name</th>
          <th>Country Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {regions.length > 0 ? (
          regions.map((region) => (
            <tr key={region.id}>
              <td>{region.name}</td>
              <td>{region.country_name}</td>
              <td>
                <Button variant="warning" onClick={() => onEdit(region)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => onDelete(region.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center">
              No regions found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default RegionTable;
