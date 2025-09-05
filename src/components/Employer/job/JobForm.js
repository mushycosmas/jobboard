import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { UniversalDataContext } from '../../../context/UniversalDataContext';


const JobForm = () => {
  const { countries, states, categories } = useContext(UniversalDataContext);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobReference: '',
    country: '',
    state: '',
    location: '',
    salary: '',
    skills: '',
    jobCategory: [],
    jobSummary: '',
    jobDescription: '',
    applyOnline: false,
    url: '',
    emailAddress: 'demo1@aynsoft.com',
    jobType: [],
    experience: 'Any experience',
    jobExpiryDate: '',
    postingDate: '',
    jobAutoRenew: 'None'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormData({
      ...formData,
      [name]: values
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <Container >
    
        <h1 className="main-heading mb-4">Post A Job</h1>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
  <Row>
    {/* Left Column */}
    <Col md={6}>
      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={4} className="text-right">Job Title:</Form.Label>
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

      </Col>
      <Col md={6}>
      
      </Col>

      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={4} className="text-right">Country:</Form.Label>
        <Col sm={8}>
          <Form.Select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="p-2"
          >
            <option value="">Select a country...</option>
          </Form.Select>
          
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={4} className="text-right">State:</Form.Label>
        <Col sm={8}>
          <Form.Select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="p-2"
          >
            <option value="">State</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={4} className="text-right">Location:</Form.Label>
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
    
    {/* Right Column */}
    <Col md={6}>
      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={4} className="text-right">Salary:</Form.Label>
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
        <Form.Label column sm={4} className="text-right">Job Skills:</Form.Label>
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
        <Form.Label column sm={4} className="text-right">Job Category:</Form.Label>
        <Col sm={8}>
          <Form.Select
            name="jobCategory"
            value={formData.jobCategory}
            onChange={handleMultiSelectChange}
            multiple
            className="p-2"
          >
            <option value="21">Accounting/Finance/Banking</option>
            <option value="1">Administration/HR/Legal</option>
            <option value="22">Advertising/Marketing/PR</option>
            <option value="3">Arts & Design</option>
            <option value="2">Automotive</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={4} className="text-right">Job Summary:</Form.Label>
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

export default JobForm
