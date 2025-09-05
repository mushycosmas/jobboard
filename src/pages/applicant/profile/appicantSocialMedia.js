import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table, Card, Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable"; // Import CreatableSelect
import { UniversalDataContext } from "../../../context/UniversalDataContext";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";

const ApplicantSocialMedia = () => {
  const { socialMedias: availableSocialMedia } = useContext(UniversalDataContext);
  const [showModal, setShowModal] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
  const [url, setUrl] = useState("");
  const applicantId = localStorage.getItem("applicantId");

  // Fetch applicant's social media links
  const fetchSocialMediaLinks = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/social-media/${applicantId}`);
      if (response.ok) {
        const data = await response.json();
        setSocialMediaLinks(data);
      } else {
        console.error("Error fetching social media links:", await response.json());
      }
    } catch (error) {
      console.error("Error fetching applicant social media links:", error);
    }
  };

  useEffect(() => {
    fetchSocialMediaLinks();
  }, [applicantId]);

  // Add new social media link
  const handleSubmit = async () => {
    if (selectedSocialMedia.length === 0 || !url) {
      alert("Please provide a valid social media and URL.");
      return;
    }

    try {
      const socialMediaToSubmit = {
        social_media_id: selectedSocialMedia[0].value,
        applicant_id: applicantId,
        url: url,
      };

      const response = await fetch(`http://localhost:4000/api/applicant/social-media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(socialMediaToSubmit),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedSocialMedia([]);
        setUrl(""); // Reset the URL input
        fetchSocialMediaLinks(); // Refresh social media links after submission
      } else {
        console.error("Error adding social media link:", await response.json());
      }
    } catch (error) {
      console.error("Error adding social media link:", error);
      alert("An error occurred while adding the social media link. Please try again.");
    }
  };

  // Delete a social media link
  const handleDelete = async (socialMediaId) => {
    if (window.confirm("Are you sure you want to delete this social media link?")) {
      try {
        const response = await fetch(`http://localhost:4000/api/applicant/social-media/${socialMediaId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchSocialMediaLinks(); // Refresh social media links after deletion
        } else {
          console.error("Error deleting social media link:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting social media link:", error);
      }
    }
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSocialMedia([]);
    setUrl(""); // Reset URL when closing the modal
  };

  return (
    <ApplicantLayout>
      <Card>
        <div className="d-flex justify-content-end m-4">
          <Button variant="primary" onClick={handleModalShow}>
            Add Social Media
          </Button>
        </div>
        <Card.Title className="text-center mb-4">Applicant Social Media Links</Card.Title>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Social Media</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {socialMediaLinks.length > 0 ? (
                socialMediaLinks.map((link) => (
                  <tr key={link.social_media_id}>
                    <td>{link.social_media_name}</td>
                    <td>{link.url}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No social media links found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Social Media Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Social Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="socialMediaSelect">
              <Form.Label>Select Social Media</Form.Label>
              <CreatableSelect
                options={availableSocialMedia.map(media => ({
                  value: media.id,
                  label: media.name,
                }))}
                isClearable
                onChange={(selected) => setSelectedSocialMedia([selected])}
                placeholder="Select or create social media"
              />
            </Form.Group>
            <Form.Group controlId="socialMediaUrl">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter your social media URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </ApplicantLayout>
  );
};

export default ApplicantSocialMedia;
