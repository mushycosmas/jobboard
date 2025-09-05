import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap'; // Added Alert component
import AdminLayout from '../../../layouts/AdminLayout';

// Default API Base URL
const API_BASE_URL = "http://localhost:4000/api/admin"; // Set the default base URL

const CvTemplate = () => {
  const [name, setName] = useState('');
  const [attachment, setAttachment] = useState(null); // Make sure attachment is null initially
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [cvTemplates, setCvTemplates] = useState([]);
  
  // State for feedback messages
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); // 'success' or 'error'
  const adminId = localStorage.getItem("userId");

  // Ensure adminId exists
  useEffect(() => {
    if (!adminId) {
      window.location.href = "/login"; // Or use React Router for navigation
    }
  }, [adminId]);

  const fetchCvTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cv`);
      if (!response.ok) {
        throw new Error('Failed to fetch CV templates');
      }
      const data = await response.json();
      setCvTemplates(data); // Set the templates to state
    } catch (error) {
      console.error("Error fetching CV templates", error);
      setResponseMessage('Error fetching CV templates');
      setResponseType('error');
    }
  };

  // Fetch CV templates from the API
  useEffect(() => {
    fetchCvTemplates();
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('creator_id', adminId);  // Include adminId as creator_id for new templates
    if (attachment) {
      formData.append('attachment', attachment); // Add the file only if it's selected
    }

    try {
      let response;
      if (isEditing) {
        // Update the existing template
        formData.append('updator_id', adminId);  // Include adminId as updator_id for updates
        response = await fetch(`${API_BASE_URL}/cv/update/${editingTemplateId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Create a new template
        response = await fetch(`${API_BASE_URL}/cv/add`, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save CV template');
      }

      // Success feedback
      setResponseMessage(isEditing ? 'CV template updated successfully' : 'CV template saved successfully');
      setResponseType('success');

      // Reset form fields
      setName('');
      setAttachment(null);
      setIsEditing(false);
      setEditingTemplateId(null);

      // Close the modal after saving
      setShowModal(false);

      // Refetch CV templates after save
      fetchCvTemplates();
    } catch (error) {
      console.error("Error saving CV template", error);
      setResponseMessage('Failed to save CV template. Please try again.');
      setResponseType('error');
    }
  };

  const handleShow = () => {
    setShowModal(true);
    setIsEditing(false); // Reset editing state
  };

  const handleEdit = (template) => {
    setShowModal(true);
    setIsEditing(true);
    setName(template.name);
    setAttachment(template.attachment); // Use file name or path if necessary
    setEditingTemplateId(template.id);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setName('');
    setAttachment(null); // Clear the attachment
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cv/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete CV template');
      }
      fetchCvTemplates();
    } catch (error) {
      console.error("Error deleting CV template", error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleShow}>
            Add CV Template
          </Button>
        </div>

        {responseMessage && (
          <Alert variant={responseType === 'success' ? 'success' : 'danger'}>
            {responseMessage}
          </Alert>
        )}

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Edit CV Template' : 'Save CV Template'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="cvName">
                <Form.Label>Template Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter template name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="cvattachment">
                <Form.Label>Template File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                {attachment && <div className="mt-2">Selected File: {attachment.name}</div>}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isEditing ? 'Update Template' : 'Save Template'}
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="mt-4">
          <h3>CV Templates</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvTemplates.map((template) => (
                <tr key={template.id}>
             
                  <td>{template.name}</td>
                  <td> <img
  src={`http://localhost:4000/${template.attachment.replace(/\\/g, '/')}`} // Convert backslashes to forward slashes
  alt={template.name}
  style={{ maxWidth: '100px', height: 'auto' }}
  onError={(e) => {
    console.error('Error loading image:', e.target.src);  // Log the error in the console
    e.target.onerror = null;  // Prevent infinite loop in case the fallback also fails
    e.target.src = 'https://via.placeholder.com/100'; // Fallback image
  }}
/></td>
                  
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(template)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(template.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CvTemplate;
