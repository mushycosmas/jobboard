"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  phone: string;
  photo?: string | null;
  region_name?: string;
  country_name?: string;
  gender?: string;
  marital_status?: string;
  summary?: string;
}

interface Experience {
  id: number;
  position: string;
  institution: string;
  from: string;
  to?: string;
  responsibilities?: string;
}

interface Education {
  id: number;
  education_level: string;
  programme: string;
  institution: string;
  ended: string;
}

interface Skill {
  skill_name: string;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

interface Collection {
  id: number | string;
  name: string;
}

interface Category {
  id: number | string;
  name: string;
}

interface Position {
  id: number | string;
  name: string;
}

interface ApplicantData {
  profile: Profile;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  socialMediaLinks?: SocialLink[];
}

interface ApplicantProfileModalProps {
  applicantData: ApplicantData;
  categories: Category[];
  positions: Position[];
  savedCollections: Collection[];
  employerId: string | number;
  setShowProfileModal: (show: boolean) => void;
}

const ApplicantProfileModal: React.FC<ApplicantProfileModalProps> = ({
  applicantData,
  categories,
  positions,
  savedCollections,
  employerId,
  setShowProfileModal,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [category, setCategory] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const [folderName, setFolderName] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = () => setShowSaveModal(true);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      category_id: category?.value || null,
      position_id: position?.value || null,
      collection_id: folderName?.value || null,
      employer_id: employerId,
      applicant_id: applicantData.profile.id,
    };

    try {
      const res = await fetch("/api/applicant/profile/saved-resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save profile");
      }

      alert("Profile saved successfully!");
      setShowSaveModal(false);
      setShowProfileModal(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert("Error saving profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Profile Modal */}
      <Modal
        show={true}
        onHide={() => setShowProfileModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{applicantData.profile.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">
            {/* Sidebar */}
            <div className="p-3 border-end" style={{ width: "30%" }}>
              <div className="text-center">
                <img
                  src={applicantData.profile.photo || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-2"
                />
                <h5>{applicantData.profile.fullName}</h5>
                <p className="text-muted">{applicantData.profile.email}</p>
                <p>{applicantData.profile.phone}</p>
                <p>
                  {applicantData.profile.region_name}, {applicantData.profile.country_name}
                </p>
                <p>
                  {applicantData.profile.gender} | {applicantData.profile.marital_status}
                </p>
              </div>

              <div className="mt-3">
                <h6>Social Media</h6>
                {applicantData.socialMediaLinks?.length ? (
                  applicantData.socialMediaLinks.map((link: SocialLink) => (
                    <p key={link.id}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.platform}
                      </a>
                    </p>
                  ))
                ) : (
                  <p>No social media links</p>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="p-3" style={{ width: "70%" }}>
              <section>
                <h5>About Me</h5>
                <p>{applicantData.profile.summary || "No summary provided."}</p>
              </section>

              <section className="mt-3">
                <h5>Work Experience</h5>
                {applicantData.experiences?.length ? (
                  <ul>
                    {applicantData.experiences.map((exp: Experience) => (
                      <li key={exp.id}>
                        <strong>{exp.position} | {exp.institution}</strong>
                        <p>{exp.from} - {exp.to || "Present"}</p>
                        <div dangerouslySetInnerHTML={{ __html: exp.responsibilities || "" }} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No work experience available</p>
                )}
              </section>

              <section className="mt-3">
                <h5>Education</h5>
                {applicantData.education?.length ? (
                  <ul>
                    {applicantData.education.map((edu: Education) => (
                      <li key={edu.id}>
                        <strong>{edu.education_level} - {edu.programme}</strong>
                        <p>{edu.institution} | {new Date(edu.ended).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No education data available</p>
                )}
              </section>

              <section className="mt-3">
                <h5>Skills</h5>
                {applicantData.skills?.length ? (
                  <div className="d-flex flex-wrap gap-2">
                    {applicantData.skills.map((skill: Skill, i: number) => (
                      <span key={i} className="badge bg-primary">{skill.skill_name}</span>
                    ))}
                  </div>
                ) : (
                  <p>No skills data available</p>
                )}
              </section>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Profile</Button>
        </Modal.Footer>
      </Modal>

      {/* Save Profile Modal */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Save Profile: {applicantData.profile.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Select
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                value={category}
                onChange={setCategory}
                placeholder="Select category"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <CreatableSelect
                options={positions.map(p => ({ value: p.id, label: p.name }))}
                value={position}
                onChange={setPosition}
                onCreateOption={(input) => setPosition({ value: input, label: input })}
                placeholder="Select or create position"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Folder</Form.Label>
              <CreatableSelect
                options={savedCollections.map(f => ({ value: f.id, label: f.name }))}
                value={folderName}
                onChange={setFolderName}
                onCreateOption={(input) => setFolderName({ value: input, label: input })}
                placeholder="Select or create folder"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save Profile"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApplicantProfileModal;
