"use client";

import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Form } from "react-bootstrap";
import { Region } from "./LocationService"; // ✅ Ensure Region includes country_name

interface Props {
  regions: Region[];
  onEdit: (region: Region) => void;
  onDelete: (id: number) => void;
}

const RegionTable: React.FC<Props> = ({ regions, onEdit, onDelete }) => {
  const [filterText, setFilterText] = useState("");

  // ✅ Define columns
  const columns = [
    {
      name: "Region Name",
      selector: (row: Region) => row.name,
      sortable: true,
    },
    {
      name: "Country Name",
      selector: (row: Region) => row.country_name || "—",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Region) => (
        <>
          <Button
            variant="warning"
            size="sm"
            className="me-2"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(row.id!)}
          >
            Delete
          </Button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // ✅ Filtered data for search
  const filteredData = regions.filter(
    (region) =>
      region.name.toLowerCase().includes(filterText.toLowerCase()) ||
      region.country_name?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      {/* 🔍 Search input */}
      <Form.Control
        type="text"
        placeholder="Search region or country..."
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
        noDataComponent="No regions found"
      />
    </div>
  );
};

export default RegionTable;
