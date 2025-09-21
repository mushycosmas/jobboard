"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Card, Table, Spinner, Button } from "react-bootstrap";
import Link from "next/link";
import EmployerLayout from "../../../Layouts/EmployerLayout";

interface SavedResume {
  id: number;
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No resumes in this collection.</p>
            )}

            <Link href="/employer/resume">
              <Button variant="secondary" className="mt-3">
                Back to Collections
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    </EmployerLayout>
  );
};

export default CollectionDetailsPage;
