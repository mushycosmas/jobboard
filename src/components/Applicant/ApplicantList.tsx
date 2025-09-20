"use client";

import React from "react";
import { Button, Card, Table, Container, Spinner, Alert } from "react-bootstrap";

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  totalExperience: string;
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
  return (
    <Container fluid className="py-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Applicant List</h5>
          <Button
            variant="light"
            size="sm"
            onClick={() => setShowFilterModal(true)}
          >
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
              <Table responsive bordered hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Experience</th>
                    <th>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                      <tr
                        key={applicant.id}
                        style={{
                          cursor: onRowClick ? "pointer" : "default",
                        }}
                        onClick={() => onRowClick?.(applicant.id)}
                      >
                        <td className="text-center">
                          <img
                            src={applicant.logo || "/placeholder.png"} // Use default if no logo
                            alt="Profile"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            className="rounded-circle border"
                          />
                        </td>
                        <td>{applicant.first_name} {applicant.last_name}</td>
                        <td>{applicant.email}</td>
                        <td>{applicant.phone_number}</td>
                        <td>{applicant.address}</td>
                        <td>{applicant.totalExperience}</td>
                        <td>{applicant.region_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-3">
                        No applicants found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

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
