"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface ApplicantProfileModalProps {
  applicantData: any; // full API object
  categories: { id: number; name: string }[];
  positions: { id: number; name: string }[];
  savedCollections: { id: number; name: string }[];
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
  const [category, setCategory] = useState<{ value: any; label: string } | null>(null);
  const [position, setPosition] = useState<{ value: any; label: string } | null>(null);
  const [folderName, setFolderName] = useState<{ value: any; label: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = () => setShowSaveModal(true);

  const handleSubmit = async () => {
    if (!category && !position && !folderName) return;

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

  const mappedExperiences = applicantData.experiences?.map((exp: any) => {
    const pos = positions.find((p) => p.id === exp.position_id);
    return {
      ...exp,
      position: pos?.name || "Unknown",
      institution: exp.institution_name || "Unknown",
      from_date: exp.from_date || "N/A",
      to_date: exp.to_date || "Present",
    };
  });

  return (
    <>
      {/* Main Profile Modal */}
      <Modal show centered size="lg" onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{applicantData.profile.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">
            {/* Sidebar */}
            <div className="p-3 border-end" style={{ width: "30%" }}>
              <div className="text-center">
                <img
                  src={applicantData.profile.logo || "https://via.placeholder.com/100"}
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
                  applicantData.socialMediaLinks.map((link: any, idx: number) => (
                    <p key={idx}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.platform || "Link"}
                      </a>
                    </p>
                  ))
                ) : (
                  <p>No social media links</p>
                )}
              </div>

              <div className="mt-3">
                <h6>Referees</h6>
                {applicantData.referees?.length ? (
                  applicantData.referees.map((ref: any, idx: number) => (
                    <p key={idx}>
                      {ref.first_name} {ref.last_name} - {ref.referee_position} (
                      {ref.institution_name || "Unknown"})
                    </p>
                  ))
                ) : (
                  <p>No referees</p>
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
                {mappedExperiences?.length ? (
                  <ul>
                    {mappedExperiences.map((exp: any, idx: number) => (
                      <li key={idx}>
                        <strong>
                          {exp.position} | {exp.institution}
                        </strong>
                        <p>
                          {exp.from_date} - {exp.to_date}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: exp.responsibility || "" }} />
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
                    {applicantData.education.map((edu: any, idx: number) => (
                      <li key={idx}>
                        <strong>
                          {edu.education_level} - {edu.programme_name}
                        </strong>
                        <p>
                          {edu.institution_name} | {edu.started} - {edu.ended}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No education data available</p>
                )}
              </section>

              <section className="mt-3">
                <h5>Professional Qualifications</h5>
                {applicantData.professionalQualifications?.length ? (
                  <ul>
                    {applicantData.professionalQualifications.map((pq: any, idx: number) => (
                      <li key={idx}>
                        {pq.institution_name} | {pq.started} - {pq.ended} <br />
                        {pq.attachment && (
                          <a href={pq.attachment} target="_blank" rel="noopener noreferrer">
                            Attachment
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No professional qualifications</p>
                )}
              </section>

              <section className="mt-3">
                <h5>Skills</h5>
                {applicantData.skills?.length ? (
                  <div className="d-flex flex-wrap gap-2">
                    {applicantData.skills.map((skill: any, idx: number) => (
                      <span key={idx} className="badge bg-primary">
                        {skill.skill_name || "Unknown"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>No skills data available</p>
                )}
              </section>

              <section className="mt-3">
                <h5>Languages</h5>
                {applicantData.languages?.length ? (
                  <ul>
                    {applicantData.languages.map((lang: any, idx: number) => (
                      <li key={idx}>
                        {lang.language_name} - Read: {lang.read} | Write: {lang.write} | Speak:{" "}
                        {lang.speak}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No language data</p>
                )}
              </section>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Profile
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Save Profile Modal */}
      <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Save Profile: {applicantData.profile.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Select
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                value={category}
                onChange={setCategory}
                placeholder="Select category"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <CreatableSelect
                options={positions.map((p) => ({ value: p.id, label: p.name }))}
                value={position}
                onChange={setPosition}
                onCreateOption={(input) => setPosition({ value: input, label: input })}
                placeholder="Select or create position"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Folder</Form.Label>
              <CreatableSelect
                options={savedCollections.map((f) => ({ value: f.id, label: f.name }))}
                value={folderName}
                onChange={setFolderName}
                onCreateOption={(input) => setFolderName({ value: input, label: input })}
                placeholder="Select or create folder"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save Profile"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApplicantProfileModal;
