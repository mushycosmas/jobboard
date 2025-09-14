"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
import Button from "react-bootstrap/Button";

import CVTemplate1 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate1";
import CVTemplate2 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate2";
import CVTemplate3 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate3";
import CVTemplate4 from "@/components/Applicant/ApplicantCV/CVTemplates/CVTemplate4";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CVData {
  profile: any;
  education: any[];
  experiences: any[];
  languages: any[];
  professionalQualifications: any[];
  skills: any[];
  referees: any[];
  socialMediaLinks: any[];
}

const CVPage: React.FC = () => {
  const { data: session } = useSession();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const hiddenCVRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch applicant CV using session.user.id
  useEffect(() => {
    if (!session?.user?.applicantId) return;

    const fetchCVData = async () => {
      try {
        const res = await fetch(`/api/applicant/profile/${session.user.applicantId}`);
        if (!res.ok) throw new Error("Failed to fetch CV data");
        const data = await res.json();
        setCvData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCVData();
  }, [session?.user?.id]);

  const templates = [
    { id: "Template 1", component: <CVTemplate1 data={cvData} /> },
    { id: "Template 2", component: <CVTemplate2 data={cvData} /> },
    { id: "Template 3", component: <CVTemplate3 data={cvData} /> },
    { id: "Template 4", component: <CVTemplate4 data={cvData} /> },
  ];

  const downloadPDF = async (templateId: string) => {
    const element = hiddenCVRefs.current[templateId];
    if (!element) return;

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

  if (!session) return <p className="text-center mt-4">Please login to view your CV</p>;
  if (!cvData) return <p className="text-center mt-4">Loading CV data...</p>;

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
