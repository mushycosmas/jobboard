// src/components/Job/JobForm.js
import React, { useState ,useContext,useEffect} from 'react';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { UniversalDataContext } from '../../context/UniversalDataContext';
import useJobs from '../../hooks/useJobs';
import { parse, format, isValid } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
const JobForm = ({ onSubmit, initialData ,setModalShow,fetchJobs}) => {
  // const [title, setTitle] = useState(initialData?.title || '');
  // const [description, setDescription] = useState(initialData?.description || '');
  const { addJob ,updateJob} = useJobs();
const { countries, states, categories, jobTypes, skills, experiences, levels, cultures, jobPrograms } = useContext(UniversalDataContext);  // Ensure jobPrograms is available in context
// Get the employer ID from localStorage for employers
 const employerId = localStorage.getItem('employerId');
 const [formData, setFormData] = useState({
  title: '',  
  employer_id: employerId || '',  // Default to empty or fetched employer ID           // Maps to "Job Title"
  region_id: '',          // Maps to "Country" (Region)
  state: '',              // Maps to "State"
  address: '',            // Maps to "Location" (Address)
  salary_from: '',        // Maps to "Salary From"
  salary_to: '',          // Maps to "Salary To"
  skill_ids: [],          // Maps to "Skills" (Multi-Select)
  type_ids: [],           // Maps to "Job Types" (Multi-Select)
  category_ids: [],       // Maps to "Job Category" (Multi-Select)
  culture_ids: [],        // Maps to "Cultures" (Multi-Select)
  summary: '',            // Maps to "Job Summary"
  description: '',        // Maps to "Job Description"
  expired_date: '',       // Maps to "Job Expiry Date"
  posting_date: '',       // Maps to "Posting Date"
  experience_id: '',      // Maps to "Experience"
  position_level_id: '',  // Maps to "Position Level"
  jobAutoRenew: 'None',
  applyOnline: false,
  url: '',
  emailAddress: 'demo1@aynsoft.com',
  gender: '',                // New field for gender
  job_education: '',        // New field for job programs/courses
});

useEffect(() => {
  if (initialData) {
    setFormData(initialData); // Populate form with job data for editing
  }
}, [initialData]);


const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === 'posting_date' || name === 'expired_date') {
    const dateObject = parse(value, 'yyyy-MM-dd', new Date());
    if (isValid(dateObject)) {
      setFormData({
        ...formData,
        [name]: dateObject.toISOString(), // Store as ISO string
      });
    }
  } else {
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }
}
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormData({
      ...formData,
      [name]: values
    });
  };

  const handleSubmit =  async(e) => {
    e.preventDefault();
  
    console.log(initialData);
  
    if (formData.id) {
      // If id is not null, update the job
      updateJob(formData); // Assuming you have an updateJob function
      console.log('Job data updated:', formData);
      setModalShow(false);
      await fetchJobs();
    } else {
      // If id is null, create a new job
      addJob(formData); // Call the addJob function
      console.log('New job data submitted:', formData);
      setModalShow(false);
      await fetchJobs();
    }
  };
  
  const handleSummaryChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      summary: value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };
 
  return (
    <Form onSubmit={handleSubmit} encType="multipart/form-data">
    {/* Job Title */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Job Title:</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-2"
        />
      </Col>
    </Form.Group>
  
    {/* Region (Country and State) */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Country:</Form.Label>
      <Col sm={9}>
        <Form.Select name="region_id" value={formData.region_id} onChange={handleChange}>
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country.id} value={country.id}>{country.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">State:</Form.Label>
      <Col sm={9}>
        <Form.Select name="state" value={formData.state} onChange={handleChange}>
          <option value="">Select State</option>
          {states.filter(state => state.countryId === parseInt(formData.region_id))
                 .map(state => (
                   <option key={state.id} value={state.id}>{state.name}</option>
                 ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
    {/* Address */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Address:</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="p-2"
        />
      </Col>
    </Form.Group>
  
    {/* Salary */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Salary From:</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="number"
          name="salary_from"
          value={formData.salary_from}
          onChange={handleChange}
          className="p-2"
        />
      </Col>
    </Form.Group>
  
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Salary To:</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="number"
          name="salary_to"
          value={formData.salary_to}
          onChange={handleChange}
          className="p-2"
        />
      </Col>
    </Form.Group>
  
    {/* Skills (Multi-Select) */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Skills:</Form.Label>
      <Col sm={9}>
        <Form.Select 
          name="skill_ids"
          value={formData.skill_ids}
          onChange={handleMultiSelectChange}
          multiple
          className="p-2"
        >
          <option value="" disabled>Select Skills</option>
          {skills.map(skill => (
            <option key={skill.id} value={skill.id}>{skill.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
    {/* Job Types (Multi-Select) */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Job Types:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="type_ids"
          value={formData.type_ids}
          onChange={handleMultiSelectChange}
          multiple
          className="p-2"
        >
          <option value="" disabled>Select Job Types</option>
          {jobTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
    {/* Categories (Multi-Select) */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Categories:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="category_ids"
          value={formData.category_ids}
          onChange={handleMultiSelectChange}
          multiple
          className="p-2"
        >
          <option value="" disabled>Select Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
    {/* Cultures (Multi-Select) */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Cultures:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="culture_ids"
          value={formData.culture_ids}
          onChange={handleMultiSelectChange}
          multiple
          className="p-2"
        >
          <option value="" disabled>Select Cultures</option>
          {cultures.map(culture => (
            <option key={culture.id} value={culture.id}>{culture.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
{/* Summary */}
<Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={3} className="text-right">
          Job Summary:
        </Form.Label>
        <Col sm={9}>
          <ReactQuill
            value={formData.summary}
            onChange={handleSummaryChange}
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                ['bold', 'italic', 'underline'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'clean'], // add image upload and link
              ],
            }}
            className="p-2"
          />
        </Col>
      </Form.Group>

      {/* Description */}
      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={3} className="text-right">
          Job Description:
        </Form.Label>
        <Col sm={9}>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                ['bold', 'italic', 'underline'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'clean'], // add image upload and link
              ],
            }}
            className="p-2"
          />
        </Col>
      </Form.Group>
  {/* Posting Date */}
  <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={3} className="text-right">Posting Date:</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="date"
            name="posting_date"
            value={formData.posting_date ? format(new Date(formData.posting_date), 'yyyy-MM-dd') : ''}
            onChange={handleChange}
            className="p-2"
          />
        </Col>
      </Form.Group>

      {/* Expired Date */}
      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={3} className="text-right">Job Expiry Date:</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="date"
            name="expired_date"
            value={formData.expired_date ? format(new Date(formData.expired_date), 'yyyy-MM-dd') : ''}
            onChange={handleChange}
            className="p-2"
          />
        </Col>
      </Form.Group>
  
    {/* Experience */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Experience Level:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="experience_id"
          value={formData.experience_id}
          onChange={handleChange}
          className="p-2"
        >
          <option value="" disabled>Select Experience</option>
          {experiences.map(exp => (
            <option key={exp.id} value={exp.id}>{exp.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  
    {/* Position Level */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Position Level:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="position_level_id"
          value={formData.position_level_id}
          onChange={handleChange}
          className="p-2"
        >
          <option value="" disabled>Select Position Level</option>
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
     {/* Gender */}
     <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={3} className="text-right">Gender:</Form.Label>
        <Col sm={9}>
          <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Job Education */}
      <Form.Group as={Row} className="align-items-center mb-2">
        <Form.Label column sm={3} className="text-right">Job Education:</Form.Label>
        <Col sm={9}>
          <Form.Select name="job_education" value={formData.job_education} onChange={handleChange}>
            <option value="">Select Education Level</option>
            <option value="high_school">High School</option>
            <option value="bachelor_degree">Bachelor's Degree</option>
            <option value="master_degree">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
          </Form.Select>
        </Col>
      </Form.Group>

 <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Apply Online:</Form.Label>
      <Col sm={9}>
        <Form.Check
          type="checkbox"
          name="applyOnline"
          checked={formData.applyOnline}
          onChange={handleChange}
          label="Check to apply online"
          className="mb-2"
        />
        {formData.applyOnline && (
          <Form.Control
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="Enter URL"
            className="p-2"
          />
        )}
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Resumes will go:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          className="p-2"
        >
          <option value="demo1@aynsoft.com">demo1@aynsoft.com</option>
          <option value="bongobas+user@gmail.com">bongobas+user@gmail.com</option>
          <option value="jamesweb@gmail.com">jamesweb@gmail.com</option>
          <option value="cr@ultima.com">cr@ultima.com</option>
          <option value="manav@gmail.com">manav@gmail.com</option>
          <option value="sasunt@outlook.com">sasunt@outlook.com</option>
        </Form.Select>
        <small className="form-text text-muted mt-2">
          To add email address, Go to Manage Users in Control Panel
        </small>
      </Col>
    </Form.Group>
     <Form.Group as={Row} className="align-items-center mb-2">
      <Form.Label column sm={3} className="text-right">Job Auto Renew:</Form.Label>
      <Col sm={9}>
        <Form.Select
          name="jobAutoRenew"
          value={formData.jobAutoRenew}
          onChange={handleChange}
          className="p-2"
        >
          <option value="0">None</option>
          <option value="3">3 Days</option>
          <option value="7">7 Days</option>
          <option value="14">14 Days</option>
          <option value="21">21 Days</option>
          <option value="28">28 Days</option>
        </Form.Select>
      </Col>
    </Form.Group>
  
    {/* Submit Button */}
    <Form.Group as={Row} className="align-items-center mb-2">
      <Col sm={{ span: 9, offset: 3 }}>
        <Button type="submit" variant="primary" className="p-2">Preview</Button>
      </Col>
    </Form.Group>
  </Form>
  
  );
};

export default JobForm;
