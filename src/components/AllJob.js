'use client'
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { UniversalDataContext } from '../context/UniversalDataContext';
import AllJobList from './AllJobList';
import JobPreview from './JobPreview';
import { useParams } from 'react-router-dom';

const AllJobs = ({ jobs }) => {
  const { slug, id } = useParams();

  const { categories, jobTypes, skills, experiences, levels, states } = useContext(UniversalDataContext);

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const formatForSelect = (data) => {
    return data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  };

  const skillsOptions = skills.length ? formatForSelect(skills) : [];

  const clearFilters = () => {
    setSelectedState('');
    setSelectedJobType('');
    setSelectedCategory('');
    setSelectedSkills([]);
    setSelectedExperience('');
    setSelectedLevel('');
    setSelectedSalary('');
  };

  // Update the selectedCategory when slug and id are available
  useEffect(() => {
    if (slug && id) {
      // Find the category with the matching id
      const matchedCategory = categories.find((category) => category.id.toString() === id);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id.toString());
      }
    }
  }, [slug, id, categories]);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const jobSkills = Array.isArray(job.skill_ids)
        ? job.skill_ids
        : job.skill_ids ? job.skill_ids.split(',').map(id => id.trim()) : [];
      const selectedSkillIds = selectedSkills.map(skill => skill.value.toString());
      const jobCategories = Array.isArray(job.category_ids)
        ? job.category_ids
        : job.category_ids ? job.category_ids.split(',').map(id => id.trim()) : [];
      const jobExperiences = job.experience_id.toString();
      const jobLevels = job.position_level_id.toString();

      const skillsMatch = selectedSkillIds.length
        ? selectedSkillIds.some(skillId => jobSkills.includes(skillId))
        : true;

      return (
        (selectedState ? job.region_id.toString() === selectedState : true) &&
        (selectedJobType ? job.jobAutoRenew === selectedJobType : true) &&
        (selectedCategory ? jobCategories.includes(selectedCategory) : true) &&
        skillsMatch &&
        (selectedExperience ? jobExperiences === selectedExperience : true) &&
        (selectedLevel ? jobLevels === selectedLevel : true) &&
        (selectedSalary ? job.salary_from <= selectedSalary && job.salary_to >= selectedSalary : true)
      );
    });

    setFilteredJobs(filtered);
  }, [
    selectedState,
    selectedJobType,
    selectedCategory,
    selectedSkills,
    selectedExperience,
    selectedLevel,
    selectedSalary,
    jobs,
  ]);

  return (
    <Container style={{ marginTop: '70px', marginBottom: '0.1rem' }}>
      {/* Filter Form */}
      <Row className="mb-1">
        <Col md={12}>
          <Form>
            <Card className="shadow-sm">
              <Card.Body>
                {/* Default Row (Visible Always) */}
                <Row className="align-items-center g-2 mb-3">
                  {/* State */}
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select
                      aria-label="State"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Job Type */}
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select
                      aria-label="Job Type"
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                    >
                      <option value="">Select Job Type</option>
                      {jobTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Category */}
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select
                      aria-label="Category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>

                {/* Expanded Row (Visible on Expand) */}
                {isExpanded && (
                  <Row className="align-items-center g-2 mb-3">
                    {/* Skills */}
                    <Col md={4} sm={6} xs={12}>
                      <Select
                        isMulti
                        options={skillsOptions}
                        value={selectedSkills}
                        onChange={setSelectedSkills}
                        placeholder="Select Skills"
                      />
                    </Col>

                    {/* Experience */}
                    <Col md={4} sm={6} xs={12}>
                      <Form.Select
                        aria-label="Experience"
                        value={selectedExperience}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                      >
                        <option value="">Select Experience</option>
                        {experiences.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    {/* Level */}
                    <Col md={4} sm={6} xs={12}>
                      <Form.Select
                        aria-label="Level"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                      >
                        <option value="">Select Level</option>
                        {levels.map((lvl) => (
                          <option key={lvl.id} value={lvl.id}>
                            {lvl.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                )}

                {/* Action Buttons */}
                <Row className="align-items-center g-2">
                  <Col md={4} sm={6} xs={12}>
                    <Button
                      variant="outline-primary"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="w-100"
                    >
                      {isExpanded ? 'Condense Filters' : 'Expand Filters'}
                    </Button>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Button
                      variant="outline-secondary"
                      onClick={clearFilters}
                      className="w-100"
                    >
                      Clear Filters
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>

      {/* Job Listings */}
      <Row>
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Available Jobs</h4>
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

export default AllJobs;
