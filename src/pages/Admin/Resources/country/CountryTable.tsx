import React from "react";
import { Table, Button } from "react-bootstrap";
import { Country } from "./CountryService";

interface Props {
  countries: Country[];
  onEdit: (country: Country) => void;
  onDelete: (id: number) => void;
}

const CountryTable: React.FC<Props> = ({ countries, onEdit, onDelete }) => {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Currency</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country.id}>
            <td>{country.name}</td>
            <td>{country.country_code}</td>
            <td>{country.currency}</td>
            <td>
              <Button variant="warning" onClick={() => onEdit(country)}>
                Edit
              </Button>
              <Button
                variant="danger"
                className="ms-2"
                onClick={() => country.id && onDelete(country.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CountryTable;
