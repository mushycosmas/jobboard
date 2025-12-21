import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import EmployerLayout from '../../../Layouts/EmployerLayout'; // Adjust if necessary

const Profile = () => {
  const [employerData, setEmployerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerData = async () => {
      // Retrieve token and userId from localStorage
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        window.location.href = '/login'; // Redirect to login if no token or userId is found
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/employers/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Send token in the header for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employer data');
        }

        const data = await response.json();
        setEmployerData(data); // Set employer data from API response
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employer data:', error);
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []); // Empty dependency array to run this effect only once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!employerData) {
    return <p>Employer data not available</p>;
  }

  return (
    <EmployerLayout>
      <section style={{ backgroundColor: '#f7f7f7' }}>
        <div className="container py-5">
          {/* Breadcrumb */}
          <div className="row">
            <div className="col">
              <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item"><a href="#">Employers</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Employer Profile</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            {/* Left Column: Employer Profile */}
            <div className="col-lg-4">
              <Card className="mb-4">
                <Card.Body className="text-center">
                  {/* Company Logo */}
                 
                  <h5 className="my-3">{employerData.company_name}</h5>
                  <p className="text-muted mb-1">{employerData.industry_name}</p>
                  <p className="text-muted mb-4">{employerData.region_name}</p>
                  <div className="d-flex justify-content-center mb-2">
                    <Button variant="primary">Follow</Button>
                    <Button variant="outline-primary" className="ms-1">Contact</Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Social Links */}
              <Card className="mb-4 mb-lg-0">
                <Card.Body p={0}>
                  <ListGroup variant="flush" className="rounded-3">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                      <i className="fas fa-globe fa-lg text-warning"></i>
                      <p className="mb-0">
                        <a href={`http://${employerData.website}`} target="_blank" rel="noopener noreferrer">
                          {employerData.website}
                        </a>
                      </p>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-linkedin fa-lg text-primary"></i>
                      <p className="mb-0">
                        <a href={employerData.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </p>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-twitter fa-lg" style={{ color: '#55acee' }}></i>
                      <p className="mb-0">
                        <a href={employerData.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </p>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-facebook-f fa-lg" style={{ color: '#3b5998' }}></i>
                      <p className="mb-0">
                        <a href={employerData.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </p>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>

            {/* Right Column: Employer Details */}
            <div className="col-lg-8">
              <Card className="mb-4">
                <Card.Body>
                  {/* Company Information */}
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">Company Name</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">{employerData.company_name}</p>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">Industry</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">{employerData.industry_name}</p>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">Location</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">{employerData.region_name}</p>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">Company Size</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">{employerData.company_size}</p>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">About the Company</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">{employerData.aboutCompany}</p>
                    </Col>
                  </Row>

                  {/* Edit Profile Button */}
                  <div className="text-center mt-4">
                    <Button variant="outline-secondary" size="sm" href="/employer/edit-profile">
                      Edit Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </EmployerLayout>
  );
};

export default Profile;
