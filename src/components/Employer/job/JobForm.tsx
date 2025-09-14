"use client";

import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { UniversalDataContext } from "@/context/UniversalDataContext";

const JobForm: React.FC = () => {
  const { countries, states, categories } = useContext(UniversalDataContext);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobReference: "",
    country: "",
    state: "",
    location: "",
    salary: "",
    skills: "",
    jobCategory: [] as string[],
    jobSummary: "",
    jobDescription: "",
    applyOnline: false,
    url: "",
    emailAddress: "demo1@aynsoft.com",
    jobType: [] as string[],
    experience: "Any experience",
    jobExpiryDate: "",
    postingDate: "",
    jobAutoRenew: "None",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // You can call your API here
  };

  return (
    <Container>
      <h1 className="main-heading mb-4">Post A Job</h1>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row>
          {/* Left Column */}
          <Col md={6}>
            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Job Title:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="p-2"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Country:
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="p-2"
                >
                  <option value="">Select a country...</option>
                  {countries?.map((c: any) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                State:
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="p-2"
                >
                  <option value="">Select a state...</option>
                  {states?.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Location:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="p-2"
                />
              </Col>
            </Form.Group>
          </Col>

          {/* Right Column */}
          <Col md={6}>
            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Salary:
              </Form.Label>
              <Col sm={8}>
                <InputGroup className="mb-2">
                  <InputGroup.Text>Rs</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="p-2"
                  />
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Job Skills:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Separated by commas"
                  required
                  className="p-2"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Job Category:
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  name="jobCategory"
                  value={formData.jobCategory}
                  onChange={handleMultiSelectChange}
                  multiple
                  className="p-2"
                >
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center mb-2">
              <Form.Label column sm={4} className="text-right">
                Job Summary:
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  name="jobSummary"
                  value={formData.jobSummary}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="p-2"
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Group as={Row} className="align-items-center mb-2">
          <Col sm={{ span: 9, offset: 3 }}>
            <Button type="submit" variant="primary" className="p-2">
              Preview
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default JobForm;
