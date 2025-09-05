import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Card } from 'react-bootstrap';

const ApplicantProfile = () => {
  const { id } = useParams(); // Get the applicant ID from the route params
  const [applicant, setApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantProfile = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/universals/applicant-profile/${id}`);
        const data = await response.json();
        if (data.success) {
          setApplicant(data.data);
        } else {
          throw new Error("Applicant not found");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicantProfile();
  }, [id]);

  return (
    <Container>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card>
          <Card.Header>{applicant.first_name} {applicant.last_name}</Card.Header>
          <Card.Body>
            <p>Email: {applicant.email}</p>
            <p>Phone: {applicant.phone_number}</p>
            <p>Address: {applicant.address}</p>
            {/* Add other fields */}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ApplicantProfile;
