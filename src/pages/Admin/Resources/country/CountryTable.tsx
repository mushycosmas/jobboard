"use client";

import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Country } from "./CountryService";

interface Props {
  countries: Country[];
  onEdit: (country: Country) => void;
  onDelete: (id: number) => void;
}

const CountryTable: React.FC<Props> = ({ countries, onEdit, onDelete }) => {
  const [filterText, setFilterText] = useState("");

  // ✅ Define table columns
  const columns = [
    {
      name: "Name",
      selector: (row: Country) => row.name,
      sortable: true,
    },
    {
      name: "Code",
      selector: (row: Country) => row.country_code || "—",
      sortable: true,
    },
    {
      name: "Currency",
      selector: (row: Country) => row.currency || "—",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Country) => (
        <div className="d-flex align-items-center">
          <Button
            variant="outline-warning"
            size="sm"
            className="me-2"
            onClick={() => onEdit(row)}
            title="Edit"
          >
            <FaEdit />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(row.id!)}
            title="Delete"
          >
            <FaTrash />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // ✅ Filter search
  const filteredData = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(filterText.toLowerCase()) ||
      country.country_code?.toLowerCase().includes(filterText.toLowerCase()) ||
      country.currency?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      {/* 🔍 Search bar */}
      <Form.Control
        type="text"
        placeholder="Search country, code, or currency..."
        className="mb-3 w-50"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {/* 🧩 Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        dense
        noDataComponent="No countries found"
      />
    </div>
  );
};

export default CountryTable;
