"use client";

import React, { useState, useMemo } from "react";
import { Card, Button, Spinner, Alert, Container, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { calculateTotalExperience } from "../../utils/experience"; // adjust path

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  experiences?: { from_date?: string; to_date?: string }[];
  region_name: string;
  logo?: string | null;
}

interface Pagination {
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface ApplicantListProps {
  applicants: Applicant[];
  pagination: Pagination;
  loading?: boolean;
  error?: string | null;
  onRowClick?: (applicantId: number) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  setShowFilterModal: (show: boolean) => void;
}

const displayValue = (value?: string | null, fallback: string = "-") =>
  value && value.trim() !== "" ? value : fallback;

const ApplicantList: React.FC<ApplicantListProps> = ({
  applicants,
  pagination,
  loading = false,
  error = null,
  onRowClick,
  onNextPage,
  onPreviousPage,
  setShowFilterModal,
}) => {
  const [searchText, setSearchText] = useState("");

  // 🔍 Filtered Data
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const fullName = `${a.first_name} ${a.last_name}`.toLowerCase();
      return (
        fullName.includes(searchText.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.phone_number?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.region_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [applicants, searchText]);

  // 🧩 Columns for DataTable
  const columns = [
    {
      name: "Profile",
      cell: (row: Applicant) => (
        <img
          src={row.logo || "/placeholder.png"}
          alt="Profile"
          style={{
            width: "45px",
            height: "45px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "1px solid #ddd",
          }}
        />
      ),
      width: "80px",
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "Name",
      selector: (row: Applicant) =>
        `${displayValue(row.first_name)} ${displayValue(row.last_name)}`,
      sortable: true,
      wrap: true,
    },
    { name: "Email", selector: (row: Applicant) => displayValue(row.email), sortable: true },
    { name: "Phone", selector: (row: Applicant) => displayValue(row.phone_number), sortable: true },
    { name: "Address", selector: (row: Applicant) => displayValue(row.address), wrap: true },
    {
      name: "Experience",
      selector: (row: Applicant) => calculateTotalExperience(row.experiences),
      sortable: true,
    },
    { name: "Region", selector: (row: Applicant) => displayValue(row.region_name), sortable: true },
  ];

  return (
    <Container fluid className="py-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Applicant List</h5>
          <Button variant="light" size="sm" onClick={() => setShowFilterModal(true)}>
            Filter
          </Button>
        </Card.Header>

        <Card.Body>
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2 text-muted">Loading applicants...</p>
            </div>
          )}

          {error && !loading && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {/* 🔍 Search Field */}
              <Form.Control
                type="text"
                placeholder="Search by name, email, phone, or region..."
                className="mb-3 w-50"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {/* 🧾 DataTable */}
              <DataTable
                columns={columns}
                data={filteredApplicants}
                pagination
                highlightOnHover
                striped
                responsive
                dense
                pointerOnHover
                noDataComponent="No applicants found"
                onRowClicked={(row) => onRowClick?.(row.id)}
              />

              {/* 🔄 Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="outline-secondary"
                  onClick={onPreviousPage}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-muted">Page {pagination.page}</span>
                <Button
                  variant="outline-secondary"
                  onClick={onNextPage}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ApplicantList;
