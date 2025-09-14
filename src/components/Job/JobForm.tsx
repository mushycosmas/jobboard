"use client";

import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { UniversalDataContext } from "../../context/UniversalDataContext";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface JobFormProps {
  setModalShow: (show: boolean) => void;
  fetchJobs?: () => void;
  initialData?: any;
}

const JobForm: React.FC<JobFormProps> = ({ setModalShow, fetchJobs, initialData }) => {
  const { data: session } = useSession();
  const { countries, states, categories, jobTypes, skills, experiences, levels, cultures } =
    useContext(UniversalDataContext);

  const [formData, setFormData] = useState<any>({
    title: "",
    employer_id: session?.user?.employerId || "",
    region_id: "",
    state: "",
    address: "",
    salary_from: "",
    salary_to: "",
    skill_ids: [] as string[],
    type_ids: [] as string[],
    category_ids: [] as string[],
    culture_ids: [] as string[],
    summary: "",
    description: "",
    expired_date: "",
    posting_date: "",
    experience_id: "",
    position_level_id: "",
    jobAutoRenew: "0",
    applyOnline: false,
    url: "",
    emailAddress: "demo1@aynsoft.com",
    gender: "",
    job_education: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        posting_date: initialData.posting_date ? initialData.posting_date.split("T")[0] : "",
        expired_date: initialData.expired_date ? initialData.expired_date.split("T")[0] : "",
        skill_ids: initialData.skill_ids || [],
        type_ids: initialData.type_ids || [],
        category_ids: initialData.category_ids || [],
        culture_ids: initialData.culture_ids || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (session?.user?.employerId) {
      setFormData((prev: any) => ({ ...prev, employer_id: session.user.employerId }));
    }
  }, [session]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type, checked } = e.target;
  
  if (type === "checkbox") {
    setFormData({ ...formData, [name]: checked });
  } else if (name === "jobAutoRenew") {
    // Convert to number
    setFormData({ ...formData, [name]: parseInt(value, 10) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setFormData({ ...formData, [name]: selectedValues });
  };

  const handleSummaryChange = (value: string) => setFormData({ ...formData, summary: value });
  const handleDescriptionChange = (value: string) => setFormData({ ...formData, description: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employer_id) return alert("You must be logged in to post a job");

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit ? `/api/job/update/${initialData.id}` : "/api/job/create";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to save job");

      console.log(`Job ${isEdit ? "updated" : "created"} successfully:`, data);
      setModalShow(false);
      if (fetchJobs) fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Network error occurred");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Job Title */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Job Title:</Form.Label>
        <Col sm={9}>
          <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
        </Col>
      </Form.Group>

      {/* Country & State */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Country:</Form.Label>
        <Col sm={9}>
          <Form.Select name="region_id" value={formData.region_id} onChange={handleChange}>
            <option value="">Select Country</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>State:</Form.Label>
        <Col sm={9}>
          <Form.Select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            {states.filter(s => s.countryId === parseInt(formData.region_id)).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Multi-selects */}
      {[{ name: "skill_ids", label: "Skills", data: skills },
        { name: "type_ids", label: "Job Types", data: jobTypes },
        { name: "category_ids", label: "Categories", data: categories },
        { name: "culture_ids", label: "Cultures", data: cultures }].map(({ name, label, data }) => (
        <Form.Group as={Row} className="mb-2" key={name}>
          <Form.Label column sm={3}>{label}:</Form.Label>
          <Col sm={9}>
            <Form.Select name={name} value={formData[name]} onChange={handleMultiSelectChange} multiple>
              {data.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Form.Select>
          </Col>
        </Form.Group>
      ))}

      {/* Summary & Description */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Summary:</Form.Label>
        <Col sm={9}><ReactQuill value={formData.summary} onChange={handleSummaryChange} /></Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Description:</Form.Label>
        <Col sm={9}><ReactQuill value={formData.description} onChange={handleDescriptionChange} /></Col>
      </Form.Group>

      {/* Posting & Expired Dates */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Posting Date:</Form.Label>
        <Col sm={9}>
          <Form.Control type="date" name="posting_date" value={formData.posting_date} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Expired Date:</Form.Label>
        <Col sm={9}>
          <Form.Control type="date" name="expired_date" value={formData.expired_date} onChange={handleChange} />
        </Col>
      </Form.Group>

      {/* Experience & Level */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Experience Level:</Form.Label>
        <Col sm={9}>
          <Form.Select name="experience_id" value={formData.experience_id} onChange={handleChange}>
            <option value="">Select Experience</option>
            {experiences.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Position Level:</Form.Label>
        <Col sm={9}>
          <Form.Select name="position_level_id" value={formData.position_level_id} onChange={handleChange}>
            <option value="">Select Level</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Gender & Education */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Gender:</Form.Label>
        <Col sm={9}>
          <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Education:</Form.Label>
        <Col sm={9}>
          <Form.Select name="job_education" value={formData.job_education} onChange={handleChange}>
            <option value="">Select Education</option>
            <option value="high_school">High School</option>
            <option value="bachelor_degree">Bachelor's</option>
            <option value="master_degree">Master's</option>
            <option value="doctorate">Doctorate</option>
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Salary */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Salary From:</Form.Label>
        <Col sm={9}>
          <Form.Control type="number" name="salary_from" value={formData.salary_from} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Salary To:</Form.Label>
        <Col sm={9}>
          <Form.Control type="number" name="salary_to" value={formData.salary_to} onChange={handleChange} />
        </Col>
      </Form.Group>

      {/* Apply Online */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Apply Online:</Form.Label>
        <Col sm={9}>
          <Form.Check type="checkbox" name="applyOnline" checked={formData.applyOnline} onChange={handleChange} label="Check to apply online" />
          {formData.applyOnline && (
            <Form.Control type="text" name="url" value={formData.url} onChange={handleChange} placeholder="Enter URL" />
          )}
        </Col>
      </Form.Group>

      {/* Email Address */}
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm={3}>Resumes will go:</Form.Label>
        <Col sm={9}>
          <Form.Select name="emailAddress" value={formData.emailAddress} onChange={handleChange}>
            <option value="demo1@aynsoft.com">demo1@aynsoft.com</option>
            <option value="bongobas+user@gmail.com">bongobas+user@gmail.com</option>
            <option value="jamesweb@gmail.com">jamesweb@gmail.com</option>
            <option value="cr@ultima.com">cr@ultima.com</option>
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Job Auto Renew */}
      {/* Job Auto Renew */}
<Form.Group as={Row} className="mb-3">
  <Form.Label column sm={3}>Job Auto Renew:</Form.Label>
  <Col sm={9}>
    <Form.Select
      name="jobAutoRenew"
      value={formData.jobAutoRenew}
      onChange={handleChange}
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


      <Button type="submit">Submit Job</Button>
    </Form>
  );
};

export default JobForm;
