'use client'
import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { fetchAllIndustry } from '../api/api'; // Assuming you have this function

const AllIndustry = () => {
  const [industries, setIndustries] = useState([]); // State to store fetched industries
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors if any

  // Fetch industries when the component mounts
  useEffect(() => {
    const getIndustries = async () => {
      try {
        const data = await fetchAllIndustry(); // Fetch data from the API
        setIndustries(data); // Update the state with the fetched data
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Error fetching industries'); // Set error if the request fails
        setLoading(false);
      }
    };

    getIndustries(); // Call the function to fetch data
  }, []); // Empty dependency array to run only once when component mounts

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container" style={{ 'marginTop': '70px', 'marginBottom': '20px' }}>
      <div className="row">
        <div className="col-md-9 mx-auto">
          <Card className="card-custom">
            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white p-3">
              <h1 className="m-0" style={{ fontSize: '1.75rem' }}>Search Job By Industry</h1>
            </Card.Header>
            <Card.Body className="card-body-custom px-3">
              <Row className="link-gray">
                {industries.map((industry, index) => (
                  <Col md={6} key={index}>
                    <Link 
                      to={`/category/${industry.slug}/${industry.id}`} // Using React Router's Link
                      title={industry.category}
                      className="industry-link"
                    >
                      {industry.category}
                    </Link>&nbsp;({industry.job_count})
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllIndustry;
