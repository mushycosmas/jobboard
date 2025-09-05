import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';

// API Endpoint
const API_URL = 'http://localhost:4000/api/admin/resource/culture';

const Culture = () => {
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCulture, setCurrentCulture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCultures = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch cultures');
      const data = await response.json();
      setCultures(data);
    } catch (error) {
      console.error('Error fetching cultures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultures();
  }, []);

  const handleShowModal = (culture = null) => {
    setCurrentCulture(culture);
    setIsEditing(!!culture);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentCulture(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${currentCulture.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCulture),
      });

      if (!response.ok) throw new Error('Failed to save culture');
      fetchCultures();
      const updatedCulture = await response.json();
      setCultures((prev) => {
        if (isEditing) {
          return prev.map((c) => (c.id === updatedCulture.id ? updatedCulture : c));
        } else {
          return [...prev, updatedCulture];
        }
      });

      handleCloseModal();
    } catch (error) {
      console.error('Error saving culture:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this culture?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete culture');

        setCultures((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error('Error deleting culture:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="content">
        <h2>Manage Cultures</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Button variant="success" onClick={() => handleShowModal()} className="mb-3">
              Add Culture
            </Button>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cultures.map((culture) => (
                  <tr key={culture.id}>
                    <td>{culture.culture_name}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleShowModal(culture)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(culture.id)} className="ms-2">Delete</Button>
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
          <Modal.Title>{isEditing ? 'Edit Culture' : 'Add Culture'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCultureName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentCulture ? currentCulture.culture_name : ''}
                onChange={(e) => setCurrentCulture({ ...currentCulture, culture_name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              {isEditing ? 'Update' : 'Add'} Culture
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default Culture;
