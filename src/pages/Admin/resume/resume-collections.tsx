"use client";

import React, { useState, useEffect } from "react";
import { Container, Card, Table, Button, Spinner } from "react-bootstrap";
import Link from "next/link";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import { useSession } from "next-auth/react";

interface Collection {
  collection_id: number;
  collection_name: string;
  position_names: string;
  category_name: string;
  Total_Data_Available: number;
}

const CvCollection: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // use session user_id

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCollections = async () => {
      try {
        // Fetch all collections for the logged-in user
        const res = await fetch(`/api/applicant/profile/saved-resumes?user_id=${userId}`);
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [userId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <EmployerLayout>
      <Container className="mt-4">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Applicant Collection</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Collection Name</th>
                  <th>Category</th>
                  <th>Position Names</th>
                  <th>Total Data Available</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {collections.length > 0 ? (
                  collections.map((col) => (
                    <tr key={col.collection_id}>
                      <td>{col.collection_name}</td>
                      <td>{col.category_name}</td>
                      <td>{col.position_names}</td>
                      <td>{col.Total_Data_Available}</td>
                      <td>
                       <Link href={`/employer/resume/${col.collection_id}`}>
                       <Button variant="info" size="sm">
                        View
                    </Button>
                     </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No collection data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </EmployerLayout>
  );
};

export default CvCollection;
