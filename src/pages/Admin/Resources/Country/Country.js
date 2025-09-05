import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Modal, Button, Form, Table ,Card,Spinner} from 'react-bootstrap';
const Country = () => {
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state


  const getCountry = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:4000/api/admin/resource/countries');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const countriesData = await getCountry();
      if (countriesData) {
        setCountries(countriesData); // Update state with fetched data
      }
    };

    fetchData();
  }, []);



  const openModal = (country = null) => {
    setCurrentCountry(country);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCountry(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = 'http://localhost:4000/api/admin/resource/new/country';
    const update_url='http://localhost:4000/api/admin/resource/update/country'
    
    
    try {
      if (currentCountry?.id) {
        const response = await fetch(`${update_url}/${currentCountry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: currentCountry.name,
            country_code: currentCountry.country_code,
            currency: currentCountry.currency,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Country updated successfully");
        getCountry(); 
      } else {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: currentCountry.name,
            country_code: currentCountry.country_code,
            currency: currentCountry.currency,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Country added successfully");
      }

      getCountry(); // Refresh data after add/update
      closeModal();
    } catch (error) {
      console.error('Error saving country:', error);
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this country?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/resource/countries/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Remove the deleted country from the state
        setCountries(countries.filter(country => country.id !== id));
      } catch (error) {
        console.error('Error deleting country:', error);
      }
    }
  };



  
  return (
    <AdminLayout>
     <div className="content">
      <Card>
        <Card.Header>
        <h4 className="mb-4">Manage Countries</h4>
        </Card.Header>
        {loading ? ( // Show loading indicator while fetching data
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading...</p>
          </div>
        ) : (
        <Card.Body>
        <Button variant="success" onClick={() => openModal()} className="mb-3">Add Country</Button>
        <Table striped  hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map(country => (
              <tr key={country.id}>
                <td>{country.name}</td>
                <td>{country.country_code}</td>
                <td>{country.currency}</td>
                <td>
                  <Button variant="warning" onClick={() => openModal(country)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(country.id)} className="ms-2">Delete</Button>
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
            <Modal.Title>{currentCountry ? 'Edit Country' : 'Add Country'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCountryName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCountry ? currentCountry.name : ''}
                  onChange={(e) => setCurrentCountry({ ...currentCountry, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCountryCode">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCountry ? currentCountry.country_code : ''}
                  onChange={(e) => setCurrentCountry({ ...currentCountry, country_code: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCountryCurrency">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCountry ? currentCountry.currency : ''}
                  onChange={(e) => setCurrentCountry({ ...currentCountry, currency: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                {currentCountry ? 'Update' : 'Add'} Country
              </Button>
            </Form>
          </Modal.Body>
          
        </Modal>
    
      </div>
   
    </AdminLayout>
  );
};

export default Country;
