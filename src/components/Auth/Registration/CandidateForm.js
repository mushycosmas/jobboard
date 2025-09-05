import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    city: '',
    contactNo: '',
    contactNo2: '', // Nullable second contact number
    logo: null, // Store uploaded logo
    userType: 'applicant',
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load countries dynamically
  useEffect(() => {
    // Replace with actual API or static data
    setCountries([
      { name: 'USA', code: 'USA' },
      { name: 'Tanzania', code: 'Tanzania' },
    ]);
  }, []);

  // Load cities based on selected country
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry });
    if (selectedCountry === 'USA') {
      setCities(['New York', 'Los Angeles', 'Chicago']); // Example cities for USA
    } else if (selectedCountry === 'Tanzania') {
      setCities(['Dar es Salaam', 'Arusha', 'Dodoma']); // Example cities for Tanzania
    } else {
      setCities([]);
    }
  };

  // Validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^255\d{9}$/; // Must start with '255' and be 12 digits
    return phonePattern.test(phoneNumber);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change (logo upload)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Validate phone numbers
    if (!validatePhoneNumber(formData.contactNo)) {
      setErrorMessage("Contact number must be exactly 12 digits and start with '255'.");
      return;
    }

    if (formData.contactNo2 && !validatePhoneNumber(formData.contactNo2)) {
      setErrorMessage("Second contact number must be exactly 12 digits and start with '255'.");
      return;
    }

    // Create FormData for file upload and other fields
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('userType', formData.userType);
    formDataToSubmit.append('firstName', formData.firstName);
    formDataToSubmit.append('lastName', formData.lastName);
    formDataToSubmit.append('address', formData.address);
    formDataToSubmit.append('contactNo', formData.contactNo);
    formDataToSubmit.append('contactNo2', formData.contactNo2);
    formDataToSubmit.append('country', formData.country);
    formDataToSubmit.append('city', formData.city);

    // Append the logo file if exists
    if (formData.logo) {
      formDataToSubmit.append('logo', formData.logo); // This sends the actual file
    }

    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        const responseData = await response.json();
        setShowModal(true); // Show success modal

        // Reset the form data
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          address: '',
          contactNo: '',
          contactNo2: '',
          logo: null,
          userType: 'applicant',
          country: '',
          city: '',
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred during registration.');
    }
  };

  return (
    <Container className="mb-5">
      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="text-center">Registration Form</Card.Title>

          {/* Error Message */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <Form onSubmit={handleSubmit}>
            {/* Account Details Section */}
            <h4>Account Details</h4>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    value={formData.email}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Enter your password"
                    value={formData.password}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Personal Details Section */}
            <h4>Personal Details</h4>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Address Section */}
            <h4>Address</h4>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    onChange={handleChange}
                    placeholder="Enter your address"
                    value={formData.address}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Country and City Section */}
            <h4>Location</h4>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="country"
                    onChange={handleCountryChange}
                    value={formData.country}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    as="select"
                    name="city"
                    onChange={handleChange}
                    value={formData.city}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Contact Number Section */}
            <h4>Contact Details</h4>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formContactNo">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactNo"
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    value={formData.contactNo}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formContactNo2">
                  <Form.Label>Second Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactNo2"
                    onChange={handleChange}
                    placeholder="Enter second phone number (optional)"
                    value={formData.contactNo2}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Logo Upload Section */}
            <h4>Upload Logo</h4>
            <Form.Group controlId="formLogo">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                type="file"
                accept=".png,.jpg,.jpeg"
                name="logo"
                onChange={handleFileChange}
                required
              />
              <Form.Text className="text-muted">
                Upload a logo (png, jpg, jpeg).
              </Form.Text>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="mt-3">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegistrationForm;
