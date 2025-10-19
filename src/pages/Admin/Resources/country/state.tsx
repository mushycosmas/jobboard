import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Modal, Button, Form, Table, Card, Spinner } from 'react-bootstrap';

const State = () => {
  const [states, setStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState('');

  const getCountry = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/admin/resource/countries');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getState = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/admin/resource/regions');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountry();
    getState();
  }, []);

  const openModal = (state = null) => {
    setCurrentState(state);
    setCurrentCountry(state ? state.country_id : ''); // Assuming country_id is stored in state
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentState(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:4000/api/admin/resource/region';

    try {
      const method = currentState?.id ? 'PUT' : 'POST';
      const endpoint = currentState?.id ? `${url}/${currentState.id}` : url;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region_name: currentState.region_name,
          country_id: currentCountry ,
          creator_id:'2'// Include the selected country ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(currentState?.id ? "State updated successfully" : "State added successfully");
      getState();
      closeModal();
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this state?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/resource/region/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setStates(states.filter(state => state.id !== id));
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="content">
        <Card>
          <Card.Header>
            <h4 className="mb-4">Manage States</h4>
          </Card.Header>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <Button variant="success" onClick={() => openModal()} className="mb-3">Add State</Button>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Country Name</th>
                    <th>State Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map(state => (
                    <tr key={state.id}>
                      <td>{state.name}</td> {/* Assuming country_name is part of the state object */}
                      <td>{state.region_name}</td>
                      <td>
                        <Button variant="warning" onClick={() => openModal(state)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(state.id)} className="ms-2">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          )}
        </Card>
        <Modal show={isModalOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{currentState ? 'Edit State' : 'Add State'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCountryName">
                <Form.Label>Country Name</Form.Label>
                <Form.Control
                  as="select"
                  value={currentCountry}
                  onChange={(e) => setCurrentCountry(e.target.value)}
                  required
                >
                  <option value="">Select a country</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    countries.map((country) => (
                      <option key={country.id} value={country.id}> {/* Use country.id instead of country.name */}
                        {country.name}
                      </option>
                    ))
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formStateName">
                <Form.Label>State Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentState ? currentState.region_name : ''}
                  onChange={(e) => setCurrentState({ ...currentState, region_name: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                {currentState ? 'Update' : 'Add'} State
              </Button>
              {loading && <Spinner animation="border" />}
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default State;
