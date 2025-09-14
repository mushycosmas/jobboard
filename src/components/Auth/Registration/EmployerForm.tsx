"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";

const EmployerForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    employerEmail: "",
    aboutCompany: "",
    address: "",
    state_id: "",
    phonenumber: "",
    logo: null as File | null,
    userType: "employer",
    industry_id: "",
    country: "",
  });

  const [states, setStates] = useState<string[]>([]);
  const [industries, setIndustries] = useState<{ id: number; name: string }[]>([]);
  const [showModal, setShowModal] = useState(false);

  const countriesWithStates: Record<string, string[]> = {
    "United States": ["California", "Texas", "Florida"],
    Canada: ["Ontario", "Quebec", "British Columbia"],
  };

  useEffect(() => {
    // Sample industries (replace with API if needed)
    setIndustries([
      { id: 1, name: "Technology" },
      { id: 2, name: "Healthcare" },
      { id: 3, name: "Finance" },
      { id: 4, name: "Retail" },
    ]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      const selectedStates = countriesWithStates[value] || [];
      setStates(selectedStates);
      setFormData((prev) => ({ ...prev, state_id: "", country: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("userType", formData.userType);
    data.append("state_id", formData.state_id);
    data.append("address", formData.address);
    data.append("phonenumber", formData.phonenumber);
    data.append("company_name", formData.companyName); // match API
    data.append("employer_email", formData.employerEmail); // match API
    data.append("aboutCompany", formData.aboutCompany);
    data.append("industry_id", formData.industry_id);

    if (formData.logo) data.append("logo", formData.logo);

    try {
      const res = await fetch("/api/employer/register", { method: "POST", body: data });

      if (res.ok) {
        setShowModal(true);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          companyName: "",
          employerEmail: "",
          aboutCompany: "",
          address: "",
          state_id: "",
          phonenumber: "",
          logo: null,
          userType: "employer",
          industry_id: "",
          country: "",
        });
      } else {
        let errorMsg = "Registration failed.";
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch {
          errorMsg = await res.text();
        }
        alert(errorMsg);
      }
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message || "An error occurred during registration.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.href = "/";
  };

  return (
    <Container>
      <h2 className="text-center mt-4">Register as Employer</h2>
      <Form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <div className="border p-4 mb-4">
          <h4>Personal Details</h4>
          <Row>
            <Col md={6}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Company Details */}
        <div className="border p-4">
          <h4>Company Details</h4>
          <Row>
            <Col md={6}>
              <Form.Group controlId="companyName">
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
            <Col md={6}>
              <Form.Group controlId="employerEmail">
                <Form.Label>Employer Email</Form.Label>
                <Form.Control
                  type="email"
                  name="employerEmail"
                  value={formData.employerEmail}
                  onChange={handleChange}
                  placeholder="Enter employer email"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="phonenumber">
                <Form.Label>Telephone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control as="select" name="country" onChange={handleChange} required>
                  <option value="">Select country</option>
                  {Object.keys(countriesWithStates).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="state_id">
                <Form.Label>State</Form.Label>
                <Form.Control
                  as="select"
                  name="state_id"
                  value={formData.state_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select state</option>
                  {states.map((state, idx) => (
                    <option key={idx} value={idx + 1}>
                      {state}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group controlId="industry_id">
                <Form.Label>Industry</Form.Label>
                <Form.Control
                  as="select"
                  name="industry_id"
                  value={formData.industry_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="aboutCompany">
            <Form.Label>About Company</Form.Label>
            <Form.Control
              as="textarea"
              name="aboutCompany"
              value={formData.aboutCompany}
              onChange={handleChange}
              placeholder="About your company"
              rows={3}
              required
            />
          </Form.Group>

          <Form.Group controlId="logo">
            <Form.Label>Company Logo</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Register as Employer
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you for registering! You will receive a confirmation email shortly.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployerForm;
