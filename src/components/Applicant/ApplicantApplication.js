import React, { useEffect, useState } from "react";
import { fetchAllApplicantApplications, updateApplicantApplication, deleteApplicantApplication } from "../../api/api";
import { Card, Table, Container, Pagination, Button, Modal, Form } from "react-bootstrap";
import moment from "moment"; // Import moment.js for date formatting

const ApplicantApplication = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 5;
  const applicantId = localStorage.getItem("applicantId");

  // State for editing
  const [showModal, setShowModal] = useState(false);
  const [editLetter, setEditLetter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [applicantId]);

  const fetchApplications = async () => {
    if (!applicantId) {
      console.error("Applicant ID not found in localStorage.");
      return;
    }
    try {
      const response = await fetchAllApplicantApplications(applicantId);
      setApplications(response.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Open modal for editing
  const handleEdit = (application) => {
    setSelectedApplication(application);
    setEditLetter(application.letter);
    setShowModal(true);
  };

  // Handle updating application letter
  const handleUpdate = async () => {
    if (!selectedApplication) return;
    try {
      await updateApplicantApplication(selectedApplication.id, { letter: editLetter });
      setShowModal(false);
      fetchApplications(); // Refresh applications
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  // Handle deleting application
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplicantApplication(id);
        fetchApplications(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  // Check if job is expired
  const isJobExpired = (expiredDate) => {
    return moment().isAfter(moment(expiredDate));
  };

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4">All Applications</h3>

          {applications.length > 0 ? (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Application Letter</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Posted Date</th>
                    <th>Expired Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.job_title}</td>
                      <td dangerouslySetInnerHTML={{ __html: app.letter }}></td>
                      <td>{app.status ? app.status : "Pending"}</td>
                      <td>{moment(app.created_at).format("MMMM Do YYYY")}</td>
                      <td>{moment(app.posted_date).format("MMMM Do YYYY")}</td>
                      <td style={{ color: isJobExpired(app.expired_date) ? "red" : "inherit" }}>
                      {moment(app.expired_date).format("MMMM Do YYYY")}
                      </td>
                      <td>
                        {!isJobExpired(app.expired_date) && (
                          <>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(app)}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(app.id)}>
                              Delete
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </>
          ) : (
            <p className="text-center">No applications found.</p>
          )}
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Application Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Application Letter</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editLetter}
                onChange={(e) => setEditLetter(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApplicantApplication;
