import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';

// API Endpoint
const API_URL = 'http://localhost:4000/api/admin/resource/type';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch experiences');
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleShowModal = (experience = null) => {
    setCurrentExperience(experience);
    setIsEditing(!!experience);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentExperience(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${currentExperience.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentExperience),
      });

      if (!response.ok) throw new Error('Failed to save experience');
      fetchExperiences();
      const updatedExperience = await response.json();
      setExperiences((prev) => {
        if (isEditing) {
          return prev.map((e) => (e.id === updatedExperience.id ? updatedExperience : e));
        } else {
          return [...prev, updatedExperience];
        }
      });

      handleCloseModal();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job type?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete job type');

        setExperiences((prev) => prev.filter((e) => e.id !== id));
      } catch (error) {
        console.error('Error deleting job type:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="content">
        <h2>Manage Experiences</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Button variant="success" onClick={() => handleShowModal()} className="mb-3">
              Add Experience
            </Button>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((experience) => (
                  <tr key={experience.id}>
                    <td>{experience.name}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleShowModal(experience)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(experience.id)} className="ms-2">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Job Type' : 'Add Job Type'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formExperienceName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentExperience ? currentExperience.name : ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              {isEditing ? 'Update' : 'Add'} Job Type
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default Experience;
