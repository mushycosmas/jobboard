"use client";

import React, { useRef } from "react";
import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
import Button from "react-bootstrap/Button";

import CVTemplate1 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate1";
import CVTemplate2 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate2";
import CVTemplate3 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate3";
import CVTemplate4 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate4";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const staticApplicantData = {
  profile: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+255 712 345 678",
    address: "Dar es Salaam, Tanzania",
    summary: "Experienced software engineer with 5+ years in full-stack development.",
  },
  educationalQualifications: [
    { degree: "BSc Computer Science", institution: "University of Dar es Salaam", year: "2018" },
  ],
  professionalQualifications: [
    { title: "AWS Certified Solutions Architect", year: "2021" },
  ],
  experiences: [
    { company: "Tech Solutions Ltd", role: "Software Engineer", duration: "2018-2021" },
    { company: "Misantechnology", role: "Senior Developer", duration: "2021-Present" },
  ],
  languages: ["English", "Swahili"],
  skills: ["ReactJS", "Node.js", "Laravel", "AWS"],
  referees: [
    { name: "Jane Smith", position: "Manager", contact: "+255 789 123 456" },
  ],
  socialMediaLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
    { platform: "GitHub", url: "https://github.com/johndoe" },
  ],
};

const CVPage: React.FC = () => {
  const templates = [
    { id: "Template 1", component: <CVTemplate1 data={staticApplicantData} /> },
    { id: "Template 2", component: <CVTemplate2 data={staticApplicantData} /> },
    { id: "Template 3", component: <CVTemplate3 data={staticApplicantData} /> },
    { id: "Template 4", component: <CVTemplate4 data={staticApplicantData} /> },
  ];

  const hiddenCVRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const downloadPDF = async (templateId: string) => {
    const element = hiddenCVRefs.current[templateId];
    if (!element) return;

    // Render full CV (no height limit)
    element.style.height = "auto";
    element.style.overflow = "visible";

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${templateId}.pdf`);
  };

  return (
    <ApplicantLayout>
      <div className="container my-4">
        <h1 className="text-center mb-4">Preview & Download CV Templates</h1>

        <div
          className="d-flex overflow-auto"
          style={{ gap: "1rem", paddingBottom: "1rem", scrollSnapType: "x mandatory" }}
        >
          {templates.map((t) => (
            <div
              key={t.id}
              className="card flex-shrink-0 shadow-sm"
              style={{
                width: "300px",
                scrollSnapAlign: "center",
                cursor: "pointer",
              }}
            >
              <div className="card-body">
                <h5 className="card-title text-center">{t.id}</h5>
                <div style={{ height: "400px", overflow: "hidden" }}>{t.component}</div>
                <Button
                  variant="success"
                  className="mt-2 w-100"
                  onClick={() => downloadPDF(t.id)}
                >
                  Download PDF
                </Button>

                {/* Hidden container for PDF */}
                <div
                  ref={(el) => (hiddenCVRefs.current[t.id] = el)}
                  style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "800px" }}
                >
                  {t.component}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ApplicantLayout>
  );
};

export default CVPage;
