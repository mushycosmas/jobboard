"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Form, Table, Card, Row, Col } from "react-bootstrap";
import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
import { UniversalDataContext } from "@/context/UniversalDataContext";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";

interface Qualification {
  id: number;
  education_level_id: string;
  category_id: string;
  programme_id: string;
  institution_id: string;
  country_id: string;
  education_level: string;
  programme: string;
  institution: string;
  country: string;
  started: string;
  ended: string;
}

interface OptionType {
  value: string | number;
  label: string;
}

const AcademicQualification = () => {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [savedQualifications, setSavedQualifications] = useState<Qualification[]>([]);
  const [formData, setFormData] = useState({
    id: null as number | null,
    applicant_id: "",
    education_level_id: "",
    category_id: "",
    programme_id: "",
    institution_id: "",
    country_id: "",
    attachment: null as File | null,
    date_from: "",
    date_to: "",
  });

  const { educationLevels, categories, programmes, institutions, countries } =
    useContext(UniversalDataContext);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.applicantId) {
      setFormData((prev) => ({
        ...prev,
        applicant_id: session.user.applicantId,
      }));
    }
  }, [session, status]);

  useEffect(() => {
    if (!formData.applicant_id) return;
    const fetchQualifications = async () => {
      try {
        const res = await fetch(`/api/applicant/academic-qualification/${formData.applicant_id}`);;
        if (!res.ok) throw new Error("Failed to fetch qualifications");
        const data = await res.json();
        setSavedQualifications(data);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      }
    };
    fetchQualifications();
  }, [formData.applicant_id]);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      id: null,
      applicant_id: formData.applicant_id,
      education_level_id: "",
      category_id: "",
      programme_id: "",
      institution_id: "",
      country_id: "",
      attachment: null,
      date_from: "",
      date_to: "",
    });
  };

  const handleProgrammeChange = (selectedOption: OptionType | null) => {
    setFormData((prev) => ({
      ...prev,
      programme_id: selectedOption ? String(selectedOption.value) : "",
    }));
  };

  const handleInstitutionChange = (selectedOption: OptionType | null) => {
    setFormData((prev) => ({
      ...prev,
      institution_id: selectedOption ? String(selectedOption.value) : "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachment: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicant_id) {
      alert("Applicant ID missing. Please login again.");
      return;
    }

    const payload = new FormData();
    payload.append("applicant_id", formData.applicant_id);
    payload.append("education_level_id", formData.education_level_id);
    payload.append("category_id", formData.category_id);
    payload.append("programme_id", formData.programme_id);
    payload.append("institution_id", formData.institution_id);
    payload.append("country_id", formData.country_id);
    payload.append("date_from", formData.date_from);
    payload.append("date_to", formData.date_to);
    if (formData.attachment) payload.append("attachment", formData.attachment);

    try {
      const url = formData.id
        ? `/api/applicant/academic-qualification/${formData.id}`
        : `/api/applicant/academic-qualification/${formData.applicant_id}`;

      const method = formData.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      if (!res.ok) throw new Error("Error saving academic qualification");

      const updatedQualification = await res.json();

      setSavedQualifications((prev) => {
        if (formData.id) {
          return prev.map((q) => (q.id === formData.id ? updatedQualification : q));
        } else {
          return [...prev, updatedQualification];
        }
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error saving academic qualification:", error);
      alert("Failed to save academic qualification.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this qualification?")) return;
    try {
      const res = await fetch(`/api/applicant/academic-qualification/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting qualification");
      setSavedQualifications((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting qualification:", error);
      alert("Failed to delete qualification.");
    }
  };

  const formatToYYYYMMDD = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (id: number) => {
    const qualification = savedQualifications.find((q) => q.id === id);
    if (!qualification) return;
    setFormData({
      id: qualification.id,
      applicant_id: formData.applicant_id,
      education_level_id: qualification.education_level_id,
      category_id: qualification.category_id,
      programme_id: qualification.programme_id,
      institution_id: qualification.institution_id,
      country_id: qualification.country_id,
      attachment: null,
      date_from: formatToYYYYMMDD(qualification.started),
      date_to: formatToYYYYMMDD(qualification.ended),
    });
    setShowModal(true);
  };

  const handleCreateNewOption = (type: "programme" | "institution") => (inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue };
    if (type === "programme") {
      setFormData((prev) => ({ ...prev, programme_id: inputValue }));
      if (!programmes.some((p: any) => p.name === inputValue)) programmes.push(newOption);
    } else if (type === "institution") {
      setFormData((prev) => ({ ...prev, institution_id: inputValue }));
      if (!institutions.some((i: any) => i.name === inputValue)) institutions.push(newOption);
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage your qualifications.</div>;

  return (
    <ApplicantLayout>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Academic Qualifications</h5>
          <Button variant="primary" onClick={handleModalShow}>
            Add Qualification
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Level</th>
                <th>Category</th>
                <th>Programme</th>
                <th>Institution</th>
                <th>Country</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedQualifications.length ? (
                savedQualifications.map((q) => (
                  <tr key={q.id}>
                    <td>{q.education_level}</td>
                    <td>{categories.find(c => c.id === q.category_id)?.name || q.category_id}</td>
                    <td>{q.programme}</td>
                    <td>{q.institution}</td>
                    <td>{q.country}</td>
                    <td>{new Date(q.started).toLocaleDateString()}</td>
                    <td>{new Date(q.ended).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(q.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(q.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No qualifications added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit Qualification" : "Add Qualification"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="education_level_id">
                  <Form.Label>Education Level</Form.Label>
                  <Form.Select
                    name="education_level_id"
                    value={formData.education_level_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Level</option>
                    {educationLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="category_id">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="programme_id">
                  <Form.Label>Programme</Form.Label>
                  <CreatableSelect
                    value={
                      formData.programme_id
                        ? { value: formData.programme_id, label: programmes.find(p => p.id === formData.programme_id)?.name || formData.programme_id }
                        : null
                    }
                    onChange={handleProgrammeChange}
                    options={programmes.map((prog) => ({ value: prog.id, label: prog.name }))}
                    isClearable
                    placeholder="Select or create programme"
                    onCreateOption={handleCreateNewOption("programme")}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="institution_id">
                  <Form.Label>Institution</Form.Label>
                  <CreatableSelect
                    value={
                      formData.institution_id
                        ? { value: formData.institution_id, label: institutions.find(i => i.id === formData.institution_id)?.name || formData.institution_id }
                        : null
                    }
                    onChange={handleInstitutionChange}
                    options={institutions.map((inst) => ({ value: inst.id, label: inst.name }))}
                    isClearable
                    placeholder="Select or create institution"
                    onCreateOption={handleCreateNewOption("institution")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="country_id">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="attachment">
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control
                    type="file"
                    name="attachment"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="date_from">
                  <Form.Label>Date From</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_from"
                    value={formData.date_from}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="date_to">
                  <Form.Label>Date To</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_to"
                    value={formData.date_to}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {formData.id ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </ApplicantLayout>
  );
};

export default AcademicQualification;
