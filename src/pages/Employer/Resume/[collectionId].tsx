"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Card, Table, Spinner, Button } from "react-bootstrap";
import Link from "next/link";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import ApplicantProfileModal from "../../../components/Applicant/ApplicantProfileModal";

interface SavedResume {
  id: number; // saved_resume ID
  applicant_id: number; // actual applicant profile ID
  first_name: string;
  last_name: string;
  logo: string;
  position_name: string | null;
  category_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
}

const CollectionDetailsPage: React.FC = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null); // full applicant profile

  useEffect(() => {
    if (!collectionId) return;

    const fetchResumes = async () => {
      try {
        const res = await fetch(
          `/api/applicant/profile/saved-resumes?collection_id=${collectionId}`
        );
        const data = await res.json();
        setResumes(data);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [collectionId]);

  const handleOpenProfile = async (resume: SavedResume) => {
    try {
      setLoadingProfile(true);

      // Fetch full applicant profile using the actual applicant_id
      const res = await fetch(`/api/applicant/profile/${resume.applicant_id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");

      const fullData = await res.json();
      setSelectedResume(fullData);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching applicant profile:", error);
      alert("Failed to fetch full profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <EmployerLayout>
      <Container>
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Collection Details</h5>
          </Card.Header>
          <Card.Body>
            {resumes.length > 0 ? (
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Position</th>
                    <th>Category</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((resume) => (
                    <tr key={resume.id}>
                      <td>
                        {resume.logo && (
                          <img
                            src={resume.logo}
                            alt="logo"
                            width={30}
                            className="me-2"
                          />
                        )}
                        {resume.first_name} {resume.last_name}
                      </td>
                      <td>{resume.position_name || "-"}</td>
                      <td>{resume.category_name || "-"}</td>
                      <td>{resume.email}</td>
                      <td>{resume.phone_number || "-"}</td>
                      <td>{resume.address || "-"}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleOpenProfile(resume)}
                        >
                          {loadingProfile ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "View Profile"
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No resumes in this collection.</p>
            )}

            <Link href="/employer/resume/candidate-profile">
              <Button variant="secondary" className="mt-3">
                Back to Collections
              </Button>
            </Link>
          </Card.Body>
        </Card>

        {/* Applicant Profile Modal */}
        {selectedResume && showProfileModal && (
          <ApplicantProfileModal
            applicantData={selectedResume} // full profile
            categories={[]} // pass actual categories
            positions={[]} // pass actual positions
            savedCollections={[]} // pass saved collections
            employerId={1} // pass actual employer id
            setShowProfileModal={setShowProfileModal}
          />
        )}
      </Container>
    </EmployerLayout>
  );
};

export default CollectionDetailsPage;
