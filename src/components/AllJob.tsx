'use client';

import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { UniversalDataContext } from '../context/UniversalDataContext';
import AllJobList from './AllJobList';
import JobPreview from './JobPreview';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const AllJobs = ({ jobs }) => {
  const router = useRouter();
  const { slug } = router.query; // Get category slug from URL
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
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [letter, setLetter] = useState('');

  const { data: session, status } = useSession();

  // Set applicant ID if logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    } else {
      setApplicantId(null);
    }
  }, [session, status]);

  const formatForSelect = (data) => data.map(item => ({ value: item.id, label: item.name }));
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

  // Pre-select category from slug
  useEffect(() => {
    if (!slug || !categories.length) return;

    if (slug === 'all') {
      setSelectedCategory('');
    } else {
      const matchedCategory = categories.find(cat => cat.slug === slug);
      if (matchedCategory) setSelectedCategory(matchedCategory.id.toString());
    }
  }, [slug, categories]);

  // Filter jobs based on selected filters
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const jobSkills = Array.isArray(job.skill_ids)
        ? job.skill_ids
        : job.skill_ids ? job.skill_ids.split(',').map(id => id.trim()) : [];
      const selectedSkillIds = selectedSkills.map(skill => skill.value.toString());
      const jobCategories = Array.isArray(job.category_ids)
        ? job.category_ids
        : job.category_ids ? job.category_ids.split(',').map(id => id.trim()) : [];
      const jobExperiences = job.experience_id?.toString() || '';
      const jobLevels = job.position_level_id?.toString() || '';

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

  // Handle job application
  const handleApply = (job) => {
    if (!applicantId) {
      alert('Only logged-in applicants can apply for this job.');
      return;
    }
    setSelectedJob({ ...job, showApplicationBox: true });
  };

  const handleSubmitApplication = () => {
    if (!letter.trim()) {
      alert('Please write an application letter.');
      return;
    }
    alert('Application submitted successfully!');
    setLetter('');
    setSelectedJob({ ...selectedJob, showApplicationBox: false });
  };

  return (
    <Container style={{ marginTop: '70px', marginBottom: '2rem' }}>
      {/* Filter Form */}
      <Row className="mb-1">
        <Col md={12}>
          <Form>
            <Card className="shadow-sm">
              <Card.Body>
                <Row className="align-items-center g-2 mb-3">
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                      <option value="">Select State</option>
                      {states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)}>
                      <option value="">Select Job Type</option>
                      {jobTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </Form.Select>
                  </Col>
                </Row>

                {isExpanded && (
                  <Row className="align-items-center g-2 mb-3">
                    <Col md={4} sm={6} xs={12}>
                      <Select
                        isMulti
                        options={skillsOptions}
                        value={selectedSkills}
                        onChange={setSelectedSkills}
                        placeholder="Select Skills"
                      />
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
                        <option value="">Select Experience</option>
                        {experiences.map(exp => <option key={exp.id} value={exp.id}>{exp.name}</option>)}
                      </Form.Select>
                    </Col>
                    <Col md={4} sm={6} xs={12}>
                      <Form.Select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                        <option value="">Select Level</option>
                        {levels.map(lvl => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}
                      </Form.Select>
                    </Col>
                  </Row>
                )}

                <Row className="align-items-center g-2">
                  <Col md={4} sm={6} xs={12}>
                    <Button variant="outline-primary" onClick={() => setIsExpanded(!isExpanded)} className="w-100">
                      {isExpanded ? 'Condense Filters' : 'Expand Filters'}
                    </Button>
                  </Col>
                  <Col md={4} sm={6} xs={12}>
                    <Button variant="outline-secondary" onClick={clearFilters} className="w-100">Clear Filters</Button>
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
              <AllJobList
                jobs={filteredJobs}
                onJobSelect={(job) => setSelectedJob(job)}
                onApply={handleApply}
                applicantId={applicantId}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          {selectedJob ? (
            <JobPreview
              job={selectedJob}
              applicantId={applicantId}
              letter={letter}
              setLetter={setLetter}
              onSubmitApplication={handleSubmitApplication}
            />
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
