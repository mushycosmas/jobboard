import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import EmployerLayout from '../../../Layouts/EmployerLayout';

const CvCollection = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const employerId = localStorage.getItem('employerId');

  // Fetch the collection data from the API
  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/universals/collection/${employerId}`);
        const data = await response.json();
        setCollectionData(data);
      } catch (error) {
        console.error('Error fetching collection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [employerId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <EmployerLayout>
      <Container>
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
                  <th>View</th> {/* New column for view action */}
                </tr>
              </thead>
              <tbody>
                {collectionData.length > 0 ? (
                  collectionData.map((collection, index) => (
                    <tr key={index}>
                      <td>{collection.collection_name}</td>
                      <td>{collection.Category}</td>
                      <td>{collection.position_names}</td>
                      <td>{collection.Total_Data_Available}</td>
                      <td>
                        <Link to={`/cv-collection/${employerId}/${collection.collection_id}`}>
                          <Button variant="info" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
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
