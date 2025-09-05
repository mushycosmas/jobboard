import React from 'react';
import { Button, Card, Table, Spinner, Container } from 'react-bootstrap';

const ApplicantList = ({
  applicants, pagination, setShowFilterModal, handleRowClick, handleNextPage, handlePreviousPage
}) => {
  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Applicant List</h5>
          <Button variant="secondary" onClick={() => setShowFilterModal(true)} className="ml-auto">
            Filter
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
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
                    onClick={() => handleRowClick(applicant.id)} // This triggers the modal open
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <img
                        src={applicant.logo ? `http://localhost:4000${applicant.logo}` : 'https://via.placeholder.com/100'}
                        alt="Logo"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
                  <td colSpan="7" className="text-center">No applicants found</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={handlePreviousPage}
              disabled={!pagination.prevPage}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={handleNextPage}
              disabled={!pagination.nextPage}
            >
              Next
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ApplicantList;
