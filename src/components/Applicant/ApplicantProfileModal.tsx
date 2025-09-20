"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface ApplicantProfileModalProps {
  applicantData: any;
  categories: { id: number; name: string }[];
  positions: { id: number; name: string }[];
  savedCollections: { id: number; name: string }[];
  employerId: string | number;
  setShowProfileModal: (show: boolean) => void;
}

// Helper functions
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

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

  const mappedExperiences = applicantData.experiences
    ?.filter((exp: any) => exp.position_id || exp.institution_name)
    .map((exp: any) => {
      const pos = positions.find((p) => p.id === exp.position_id);
      return {
        ...exp,
        position: pos?.name || null,
        institution: exp.institution_name || null,
        from_date: formatDate(exp.from_date),
        to_date: formatDate(exp.to_date) === null ? "Present" : formatDate(exp.to_date),
      };
    });

  const renderSection = (title: string, items: any[], renderItem: (item: any, idx: number) => JSX.Element) => {
    if (!items || !items.length) return null;
    return (
      <section className="mt-3">
        <h5>{title}</h5>
        <ul style={{ paddingLeft: "1rem", lineHeight: 1.6 }}>{items.map(renderItem)}</ul>
      </section>
    );
  };

  return (
    <>
      {/* Main Profile Modal */}
      <Modal show centered size="lg" onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{applicantData.profile.fullName || ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ wordBreak: "break-word", lineHeight: 1.6 }}>
          <div className="d-flex">
            {/* Sidebar */}
            <div className="p-3 border-end" style={{ width: "30%" }}>
              <div className="text-center">
                <img
                  src={applicantData.profile.logo || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-2"
                />
                {applicantData.profile.fullName && <h5 style={{ marginBottom: "0.5rem" }}>{applicantData.profile.fullName}</h5>}
                {applicantData.profile.email && <p className="text-muted mb-1">{applicantData.profile.email}</p>}
                {applicantData.profile.phone && <p className="mb-1">{applicantData.profile.phone}</p>}
                {(applicantData.profile.region_name || applicantData.profile.country_name) && (
                  <p className="mb-1">
                    {applicantData.profile.region_name || ""} {applicantData.profile.country_name || ""}
                  </p>
                )}
                {(applicantData.profile.gender || applicantData.profile.marital_status) && (
                  <p className="mb-1">
                    {applicantData.profile.gender || ""}{" "}
                    {applicantData.profile.marital_status ? `| ${applicantData.profile.marital_status}` : ""}
                  </p>
                )}
              </div>

              {applicantData.socialMediaLinks?.length > 0 && (
                <div className="mt-3">
                  <h6>Social Media</h6>
                  {applicantData.socialMediaLinks.map((link: any, idx: number) =>
                    link.url ? (
                      <p key={idx} style={{ marginBottom: "0.3rem" }}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.platform || "Link"}
                        </a>
                      </p>
                    ) : null
                  )}
                </div>
              )}

              {applicantData.referees?.length > 0 && (
                <div className="mt-3">
                  <h6>Referees</h6>
                  {applicantData.referees.map((ref: any, idx: number) =>
                    ref.first_name || ref.last_name ? (
                      <p key={idx} style={{ marginBottom: "0.3rem" }}>
                        {ref.first_name || ""} {ref.last_name || ""}{" "}
                        {ref.referee_position ? `- ${ref.referee_position}` : ""}{" "}
                        {ref.institution_name ? `(${ref.institution_name})` : ""}
                      </p>
                    ) : null
                  )}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="p-3" style={{ width: "70%" }}>
              {applicantData.profile.summary && (
                <section>
                  <h5>About Me</h5>
                  <p style={{ marginBottom: "0.5rem" }}>{applicantData.profile.summary}</p>
                </section>
              )}

              {renderSection("Work Experience", mappedExperiences || [], (exp, idx) => (
                <li key={idx}>
                  {(exp.position || exp.institution) && (
                    <strong style={{ display: "block", wordBreak: "break-word", marginBottom: "0.3rem" }}>
                      {exp.position} {exp.institution ? `| ${exp.institution}` : ""}
                    </strong>
                  )}
                  <p style={{ marginBottom: "0.3rem" }}>
                    {exp.from_date} - {exp.to_date}
                  </p>
                  {exp.responsibility && (
                    <div
                      style={{ marginBottom: "0.5rem" }}
                      dangerouslySetInnerHTML={{ __html: exp.responsibility }}
                    />
                  )}
                </li>
              ))}

              {renderSection("Education", applicantData.education || [], (edu, idx) =>
                edu.education_level || edu.programme_name ? (
                  <li key={idx}>
                    <strong style={{ display: "block", wordBreak: "break-word", marginBottom: "0.3rem" }}>
                      {edu.education_level} {edu.programme_name ? `- ${edu.programme_name}` : ""}
                    </strong>
                    <p style={{ marginBottom: "0.3rem" }}>
                      {edu.institution_name ? `${edu.institution_name} | ` : ""}
                      {edu.started ? formatDate(edu.started) : ""} - {edu.ended ? formatDate(edu.ended) : ""}
                    </p>
                  </li>
                ) : null
              )}

              {renderSection("Professional Qualifications", applicantData.professionalQualifications || [], (pq, idx) =>
                pq.institution_name ? (
                  <li key={idx}>
                    <strong style={{ display: "block", wordBreak: "break-word", marginBottom: "0.3rem" }}>
                      {pq.institution_name}
                    </strong>
                    <p style={{ marginBottom: "0.3rem" }}>
                      {pq.started ? formatDate(pq.started) : ""} - {pq.ended ? formatDate(pq.ended) : ""}
                    </p>
                    {pq.attachment && (
                      <a href={pq.attachment} target="_blank" rel="noopener noreferrer">
                        Attachment
                      </a>
                    )}
                  </li>
                ) : null
              )}

              {applicantData.skills?.length > 0 && (
                <section className="mt-3">
                  <h5>Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {applicantData.skills.map((skill: any, idx: number) =>
                      skill.skill_name ? (
                        <span key={idx} className="badge bg-primary">
                          {skill.skill_name}
                        </span>
                      ) : null
                    )}
                  </div>
                </section>
              )}

              {renderSection("Languages", applicantData.languages || [], (lang, idx) =>
                lang.language_name ? (
                  <li key={idx}>
                    {lang.language_name}{" "}
                    {lang.read ? `- Read: ${lang.read}` : ""}{" "}
                    {lang.write ? `| Write: ${lang.write}` : ""}{" "}
                    {lang.speak ? `| Speak: ${lang.speak}` : ""}
                  </li>
                ) : null
              )}
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
