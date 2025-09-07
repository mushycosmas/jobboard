'use client'; // if you use Next.js 13 app router, otherwise omit

import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card } from 'react-bootstrap';
import AllJobList from '../../components/AllJobList';  // Your component to list jobs
import JobPreview from '../../components/JobPreview';  // Your component to show job details preview

interface Job {
  id: number;
  title: string;
  company_name: string;
  // add other job properties you need here
}

interface JobCategoriesListProps {
  jobs: Job[];
}

const JobCategoriesList: React.FC<JobCategoriesListProps> = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    searchText: '',
    location: '',
    jobType: '',
    skills: '',
    salary: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement filtering logic or API call here based on filters
    // For now just console.log
    console.log('Filters:', filters);
  };

  // Optionally filter jobs client-side if no API call
  const filteredJobs = jobs.filter((job) => {
    // Basic filter by search text (title/company)
    const searchLower = filters.searchText.toLowerCase();
    if (searchLower && !job.title.toLowerCase().includes(searchLower) && !job.company_name.toLowerCase().includes(searchLower)) {
      return false;
    }
    // Add more filter logic for location, jobType, skills, salary if job object has those fields
    return true;
  });

  return (
    <Container style={{ marginTop: '70px', marginBottom: '0.7rem' }}>
      <Row className="mb-4">
        <Col md={12}>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-center mb-2">
              <Col md={2}>
                <InputGroup>
                  <Form.Control
                    name="searchText"
                    type="text"
                    placeholder="Search jobs..."
                    value={filters.searchText}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <InputGroup>
                  <Form.Control
                    name="location"
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select name="jobType" aria-label="Job Type" value={filters.jobType} onChange={handleInputChange}>
                  <option value="">Job Type</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select name="skills" aria-label="Skills" value={filters.skills} onChange={handleInputChange}>
                  <option value="">Select Skills</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="react">React</option>
                  <option value="nodejs">Node.js</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <InputGroup>
                  <Form.Control
                    name="salary"
                    type="number"
                    placeholder="Salary"
                    aria-label="Salary"
                    value={filters.salary}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button variant="primary" type="submit" className="w-100">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-2">Available Jobs</h4>
              <AllJobList jobs={filteredJobs} onJobSelect={setSelectedJob} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          {selectedJob ? (
            <JobPreview job={selectedJob} />
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <h5>Select a job to preview details</h5>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default JobCategoriesList;
