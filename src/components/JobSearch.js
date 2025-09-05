'use client';

import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Select from 'react-select'; 
import { UniversalDataContext } from '../context/UniversalDataContext';

const JobSearch = ({ onSearch }) => {
  const { categories, jobTypes, skills, experiences, levels, states } = useContext(UniversalDataContext);

  const [selectedState, setSelectedState] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const clearFilters = () => {
    setSelectedState('');
    setSelectedJobType('');
    setSelectedCategory('');
    setSelectedSkills([]);
    setSelectedExperience('');
    setSelectedLevel('');
    onSearch({
      state: '',
      jobType: '',
      category: '',
      skills: [],
      experience: '',
      level: '',
    });
  };

  const handleSearch = () => {
    onSearch({
      state: selectedState,
      jobType: selectedJobType,
      category: selectedCategory,
      skills: selectedSkills.map(skill => skill.value),
      experience: selectedExperience,
      level: selectedLevel,
    });
  };

  return (
    <div className="text-white py-5" style={{ backgroundColor: '#0069A8' }}>
      <Container>
        <Row>
          <Col md={10} className="mx-auto text-center">
            <h1 className="fw-bold display-5">Locate the perfect role for your life</h1>
            <h5 className="mb-4">Aligning exceptional career opportunities with top talent.</h5>
            <Card className="shadow-sm text-white" style={{ backgroundColor: '#0084D1', borderRadius: '12px', boxShadow: '0 7px 14px 0 rgba(8, 15, 52, 0.3)' }}>
              <Card.Body>
                <Row className="align-items-center g-2 mb-3">
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select aria-label="State" value={selectedState} onChange={(e) => { setSelectedState(e.target.value); handleSearch(); }}>
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select aria-label="Job Type" value={selectedJobType} onChange={(e) => { setSelectedJobType(e.target.value); handleSearch(); }}>
                      <option value="">Select Job Type</option>
                      {jobTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select aria-label="Category" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); handleSearch(); }}>
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>

                {isExpanded && (
                  <Row className="align-items-center g-2 mb-3">
                    <Col md={4} sm={6} xs={12}>
                      <Select
                        isMulti
                        options={skills.map(skill => ({ value: skill.id, label: skill.name }))}
                        value={selectedSkills}
                        onChange={(selectedOptions) => { setSelectedSkills(selectedOptions); handleSearch(); }}
                        placeholder="Select Skills"
                      />
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Select aria-label="Experience" value={selectedExperience} onChange={(e) => { setSelectedExperience(e.target.value); handleSearch(); }}>
                        <option value="">Select Experience</option>
                        {experiences.map(exp => (
                          <option key={exp.id} value={exp.id}>{exp.name}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Select aria-label="Level" value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); handleSearch(); }}>
                        <option value="">Select Level</option>
                        {levels.map(lvl => (
                          <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                )}

                <Row className="align-items-center g-2">
                  <Col md={4} sm={6} xs={12}>
                    <Button variant="outline-light" onClick={() => setIsExpanded(!isExpanded)} className="w-100">
                      {isExpanded ? 'Condense Filters' : 'Expand Filters'}
                    </Button>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Button style={{ backgroundColor: '#F9AB00', color: 'white' }} onClick={clearFilters} className="w-100">
                      Clear Filters
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JobSearch;
