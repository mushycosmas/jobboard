import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import EmployerLayout from '../../../Layouts/EmployerLayout';
import { useNavigate } from 'react-router-dom';
import { UniversalDataContext } from '../../../context/UniversalDataContext';

const EditProfile = () => {
  const { states, categories } = useContext(UniversalDataContext); // Ensure jobPrograms is available in context
  const navigate = useNavigate();

  // State to hold the form data (including all the fields)
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    logo: '',
    phonenumber: '',
    companySize: '',
    employerEmail: '',
    aboutCompany: '',
    region: '', // Add your region/state field
    industry: '', // Add industry field
    twitter: '',
    facebook: '',
    linkedin: '',
  });

  // Fetch the current user data (to populate the form fields)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          const response = await fetch(`http://localhost:4000/api/employers/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Set form data from API response
            setFormData({
              companyName: data.company_name,
              address: data.address,
              logo: data.logo,
              phonenumber: data.phonenumber,
              companySize: data.company_size || '', // Optional field, may be null
              employerEmail: data.employer_email,
              aboutCompany: data.aboutCompany,
              region: data.state_id, // Set the region name
              industry: data.industry_id, // Set the industry
              twitter: data.twitter || '',
              facebook: data.facebook || '',
              linkedin: data.linkedin || '',
            });
          }
        } catch (error) {
          console.error('Error fetching employer profile:', error);
        }
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      try {
        const response = await fetch(`http://localhost:4000/api/employers/update/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // After a successful update, redirect to the dashboard or wherever you want
          alert('Profile updated successfully!');
          //navigate('/employer/dashboard'); // Or to the appropriate dashboard
         console.log(formData);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during profile update:', error);
        alert('An error occurred while updating the profile.');
      }
    }
  };

  return (
    <EmployerLayout>
      <Container>
        <Card className="p-4 shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-4">Edit Profile</h2>
            <Form onSubmit={handleSubmit}>
              {/* Company Name */}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formCompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Address */}
                <Col md={6}>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter company address"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Phone Number & Company Size */}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formPhonenumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCompanySize">
                    <Form.Label>Company Size</Form.Label>
                    <Form.Control
                      type="text"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      placeholder="Enter company size"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Employer Email & About the Company */}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formEmployerEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="employerEmail"
                      value={formData.employerEmail}
                      onChange={handleChange}
                      placeholder="Enter employer email"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formAboutCompany">
                    <Form.Label>About the Company</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="aboutCompany"
                      value={formData.aboutCompany}
                      onChange={handleChange}
                      placeholder="Write about the company"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Region & Industry */}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formRegion">
                    <Form.Label>Region</Form.Label>
                    <Form.Select
                      name="region"
                      value={formData.state_id}
                      onChange={handleChange}
                      className="p-2"
                    >
                      <option value="" disabled>Select Region</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formIndustry">
                    <Form.Label>Industry</Form.Label>
                    <Form.Select
                      name="industry"
                      value={formData.industry_id}
                      onChange={handleChange}
                      className="p-2"
                    >
                      <option value="" disabled>Select Industry</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Social Media Links */}
              <Row>
                <Col md={4}>
                  <Form.Group controlId="formTwitter">
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="Enter Twitter profile URL"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="formFacebook">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="Enter Facebook profile URL"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="formLinkedin">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="Enter LinkedIn profile URL"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Submit Button */}
              <Button variant="primary" type="submit" className="mt-4 w-100">
                Save Changes
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </EmployerLayout>
  );
};

export default EditProfile;
