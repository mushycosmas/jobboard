import React, { useState, useEffect } from "react";
import ApplicantLayout from "../../../Layouts/ApplicantLayout";

const Modal = ({ show, onClose, template, onSave }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "600px",
          textAlign: "center",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>Preview CV Template</h2>
        <div
          style={{
            flex: 1,
            maxHeight: "500px",
            overflowY: "auto",
            marginBottom: "20px",
          }}
        >
          <img
            src={`http://localhost:4000/${template?.attachment}`}
            alt={template?.name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: "5px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <button
            onClick={onSave}
            style={{
              flex: 1,
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Select This Template
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicantCvBuilder = () => {
  const [cvTemplates, setCvTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const applicantId = 1; // Replace with the actual applicant ID from context or props

  useEffect(() => {
    const fetchCvTemplates = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/universals/cv");
        const data = await response.json();
        setCvTemplates(data);
      } catch (error) {
        console.error("Error fetching CV templates:", error);
      }
    };

    fetchCvTemplates();
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const openPreviewModal = (template) => {
    setCurrentTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setCurrentTemplate(null);
  };

  const handleSaveTemplate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/applicant/cv/save/${applicantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId: currentTemplate.id }),
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedTemplate(currentTemplate);
        console.log("Template saved successfully:", result);
        closePreviewModal();
      } else {
        console.error("Failed to save template:", await response.json());
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  return (
    <ApplicantLayout>
      <h2>CV Templates</h2>
      {cvTemplates.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Change min width to 300px for medium size
            gap: "20px",
          }}
        >
          {cvTemplates.map((template) => (
            <div
              key={template.id}
              style={{
                padding: "10px",
                border: template.name === "basic" ? "3px solid green" : "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
            >
              <h3>{template.name}</h3>
              <img
                src={`http://localhost:4000/${template.attachment}`}
                alt={template.name}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "5px",
                }}
              />
              <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
                <button
                  onClick={() => openPreviewModal(template)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196F3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Preview
                </button>
             
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No CV templates available.</p>
      )}

      <Modal
        show={isPreviewModalOpen}
        onClose={closePreviewModal}
        template={currentTemplate}
        onSave={handleSaveTemplate}
      />
    </ApplicantLayout>
  );
};

export default ApplicantCvBuilder;
