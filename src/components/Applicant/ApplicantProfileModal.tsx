"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { calculateTotalExperience } from "../../utils/experience"; 

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
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const displayValue = (value: string | null | undefined) =>
  value && value.trim() !== "" ? value : null;

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
      applicant_id: applicantData?.profile?.id,
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

  // Map experiences
  const mappedExperiences = applicantData?.experiences
    ?.map((exp: any) => {
      const pos = positions.find((p) => p.id === exp.position_id);
      const positionName = displayValue(pos?.name);
      const institutionName = displayValue(exp?.institution_name);
      if (!positionName && !institutionName) return null;

      return {
        ...exp,
        position: positionName,
        institution: institutionName,
        from_date: formatDate(exp?.from_date),
        to_date: formatDate(exp?.to_date) || "Present",
      };
    })
    .filter(Boolean);

  const totalExperience = calculateTotalExperience(applicantData?.experiences || []);

  const filteredEducation = applicantData?.education?.filter(
    (edu: any) =>
      displayValue(edu?.education_level) ||
      displayValue(edu?.programme_name) ||
      displayValue(edu?.institution_name)
  );

  const filteredProfessional = applicantData?.professionalQualifications?.filter(
    (pq: any) => displayValue(pq?.institution_name)
  );

  const filteredSkills = applicantData?.skills?.filter((s: any) => displayValue(s?.skill_name));

  const filteredLanguages = applicantData?.languages?.filter(
    (l: any) => displayValue(l?.language_name)
  );

  const referees = applicantData?.referees || [];

  return (
    <>
      {/* Main Profile Modal */}
      <Modal show centered size="lg" onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{displayValue(applicantData?.profile?.fullName)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap">
            {/* Sidebar */}
            <div className="p-3 border-end" style={{ width: "30%" }}>
              <div className="text-center">
                <img
                  src={applicantData?.profile?.logo || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-2"
                />
                {displayValue(applicantData?.profile?.fullName) && (
                  <h5>{applicantData.profile.fullName}</h5>
                )}
                {displayValue(applicantData?.profile?.email) && (
                  <p className="text-muted">{applicantData.profile.email}</p>
                )}
                {displayValue(applicantData?.profile?.phone) && (
                  <p>{applicantData.profile.phone}</p>
                )}
                {(displayValue(applicantData?.profile?.region_name) ||
                  displayValue(applicantData?.profile?.country_name)) && (
                  <p>
                    {applicantData.profile.region_name || ""}
                    {applicantData.profile.country_name
                      ? `, ${applicantData.profile.country_name}`
                      : ""}
                  </p>
                )}
                {(displayValue(applicantData?.profile?.gender) ||
                  displayValue(applicantData?.profile?.marital_status)) && (
                  <p>
                    {applicantData.profile.gender || ""}
                    {applicantData.profile.marital_status
                      ? ` | ${applicantData.profile.marital_status}`
                      : ""}
                  </p>
                )}
              </div>

              {/* Social Media */}
              {applicantData?.socialMediaLinks?.length > 0 && (
                <div className="mt-3">
                  <h6>Social Media</h6>
                  {applicantData.socialMediaLinks.map((link: any, idx: number) => {
                    if (!link?.url) return null;
                    let Icon = FaGlobe;
                    const platform = (link.platform || "").toLowerCase();
                    if (platform.includes("linkedin")) Icon = FaLinkedin;
                    else if (platform.includes("twitter")) Icon = FaTwitter;
                    else if (platform.includes("facebook")) Icon = FaFacebook;
                    else if (platform.includes("instagram")) Icon = FaInstagram;

                    return (
                      <p
                        key={idx}
                        style={{
                          marginBottom: "0.3rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Icon />
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.platform || "Link"}
                        </a>
                      </p>
                    );
                  })}
                </div>
              )}

              {/* Referees */}
              {referees.length > 0 && (
                <div className="mt-3">
                  <h6>Referees</h6>
                  {referees.map((ref: any, idx: number) => {
                    const fullName =
                      [ref?.first_name, ref?.last_name].filter(Boolean).join(" ") || "N/A";
                    const position = ref?.referee_position || "N/A";
                    const institution = ref?.institution_name || "";
                    const email = ref?.email || "";
                    const phone = ref?.phone || "";

                    return (
                      <div key={idx} style={{ marginBottom: "0.5rem" }}>
                        <strong>{fullName}</strong> - {position}
                        {institution && ` | ${institution}`}
                        {email && <div>Email: {email}</div>}
                        {phone && <div>Phone: {phone}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="p-3" style={{ width: "70%" }}>
              {/* About Me */}
              {displayValue(applicantData?.profile?.summary) && (
                <section>
                  <h5>About Me</h5>
                  <p style={{ whiteSpace: "pre-line" }}>{applicantData.profile.summary}</p>
                </section>
              )}

              {/* Work Experience */}
              {mappedExperiences?.length > 0 && (
                <section className="mt-3">
                  <h5>Work Experience</h5>
                  <p><strong>Total Experience:</strong> {totalExperience}</p>
                  <ul>
                    {mappedExperiences.map((exp: any, idx: number) => (
                      <li key={idx} style={{ marginBottom: "0.5rem", wordBreak: "break-word" }}>
                        <strong>
                          {exp.position} {exp.institution ? `| ${exp.institution}` : ""}
                        </strong>
                        <p>{exp.from_date} - {exp.to_date}</p>
                        {exp.responsibility && (
                          <div
                            style={{ whiteSpace: "pre-line" }}
                            dangerouslySetInnerHTML={{ __html: exp.responsibility }}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Education */}
              {filteredEducation?.length > 0 && (
                <section className="mt-3">
                  <h5>Education</h5>
                  <ul>
                    {filteredEducation.map((edu: any, idx: number) => (
                      <li key={idx} style={{ marginBottom: "0.5rem", wordBreak: "break-word" }}>
                        <strong>
                          {edu.education_level || ""}{" "}
                          {edu.programme_name ? `- ${edu.programme_name}` : ""}
                        </strong>
                        {edu.institution_name && (
                          <p>
                            {edu.institution_name} |{" "}
                            {edu.started && formatDate(edu.started)} -{" "}
                            {edu.ended && formatDate(edu.ended)}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Professional Qualifications */}
              {filteredProfessional?.length > 0 && (
                <section className="mt-3">
                  <h5>Professional Qualifications</h5>
                  <ul>
                    {filteredProfessional.map((pq: any, idx: number) => (
                      <li key={idx} style={{ marginBottom: "0.5rem", wordBreak: "break-word" }}>
                        {pq.institution_name} | {pq.started && formatDate(pq.started)} - {pq.ended && formatDate(pq.ended)}
                        {pq.attachment && (
                          <>
                            <br />
                            <a href={pq.attachment} target="_blank" rel="noopener noreferrer">
                              Attachment
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Skills */}
              {filteredSkills?.length > 0 && (
                <section className="mt-3">
                  <h5>Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {filteredSkills.map((skill: any, idx: number) => (
                      <span key={idx} className="badge bg-primary">{skill.skill_name}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {filteredLanguages?.length > 0 && (
                <section className="mt-3">
                  <h5>Languages</h5>
                  <ul>
                    {filteredLanguages.map((lang: any, idx: number) => (
                      <li key={idx}>
                        {lang.language_name}{" "}
                        {lang.read || lang.write || lang.speak
                          ? `- Read: ${lang.read || "-"} | Write: ${lang.write || "-"} | Speak: ${lang.speak || "-"}`
                          : ""}
                      </li>
                    ))}
                  </ul>
                </section>
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
          <Modal.Title>Save Profile: {displayValue(applicantData?.profile?.fullName)}</Modal.Title>
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
