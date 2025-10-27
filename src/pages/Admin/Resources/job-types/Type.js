import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import AdminLayout from '../../../../layouts/AdminLayout';

// API Endpoint
const API_URL = 'http://localhost:4000/api/admin/resource/type'; // Adjust the endpoint as necessary

const Type = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentType, setCurrentType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchTypes = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch types');
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleShowModal = (type = null) => {
    setCurrentType(type);
    setIsEditing(!!type); // Set editing mode if a type is passed
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentType(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${currentType.id}` : API_URL; // Use correct URL for POST

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentType),
      });

      if (!response.ok) throw new Error('Failed to save type');

      fetchTypes();
      const updatedType = await response.json();
      setTypes((prev) => {
        if (isEditing) {
          return prev.map((t) => (t.id === updatedType.id ? updatedType : t));
        } else {
          return [...prev, updatedType];
        }
      });
      fetchTypes();
      handleCloseModal();

    } catch (error) {
      console.error('Error saving type:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this type?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/resource/type/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) throw new Error('Failed to delete type');
  
        setTypes((prev) => prev.filter((t) => t.id !== id));
      } catch (error) {
        console.error('Error deleting type:', error);
      }
    }
  };
  

  return (
    <AdminLayout>
      <div className="content">
        <h2>Manage Types</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Button variant="success" onClick={() => handleShowModal()} className="mb-3">
              Add Type
            </Button>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Type Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr key={type.id}>
                    <td>{type.name}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleShowModal(type)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(type.id)} className="ms-2">Delete</Button>
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
          <Modal.Title>{isEditing ? 'Edit Type' : 'Add Type'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTypeName">
              <Form.Label>Type Name</Form.Label>
              <Form.Control
                type="text"
                value={currentType ? currentType.name : ''}
                onChange={(e) => setCurrentType({ ...currentType, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              {isEditing ? 'Update' : 'Add'} Type
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default Type;
