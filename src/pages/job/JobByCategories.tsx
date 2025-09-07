import React, { useState,useEffect} from 'react';
import { fetchAllJobs } from '../../api/api'; 
import Layout from '../../components/Layout';

import AllJobs from '../../components/AllJob';

const JobByCategories = () => {
  const [jobs, setJobs] = useState([]); // To store the fetched jobs
   const [loading, setLoading] = useState(true); // To manage loading state
   const [error, setError] = useState(null); // To manage error state
   const [categoryId, setCategoryId] = useState(null); // State for categoryId
 
   // Fetch jobs when categoryId changes or on initial load
   useEffect(() => {
     const getJobs = async () => {
       setLoading(true);
       console.log('Fetching jobs for categoryId:', categoryId); // Debugging log
 
       try {
         // Fetch jobs from the API based on categoryId
         const response = await fetchAllJobs(categoryId); // If categoryId is null, fetchAllJobs will fetch all jobs
         setJobs(response); // Store the fetched jobs in the state
 
         // Cache jobs and update the timestamp
         const now = Date.now();
         localStorage.setItem('jobs', JSON.stringify(response));
         localStorage.setItem('jobs_last_updated', now.toString());
       } catch (err) {
         setError('Failed to fetch jobs');
         console.error(err);
       } finally {
         setLoading(false); // Set loading to false once data is fetched
       }
     };
 
     // Only fetch if categoryId has changed or on first load
     getJobs();
 
   }, [categoryId]); // Re-run when categoryId changes
 
   // Function to handle category change (e.g., when a user selects a category)
   const handleCategoryChange = (event) => {
     const selectedCategoryId = event.target.value ? parseInt(event.target.value) : null;
     console.log('Category selected:', selectedCategoryId); // Debugging log
     setCategoryId(selectedCategoryId); // Update categoryId state when category changes
   };
 
   if (loading) {
     return <div>Loading...</div>; // Show a loading state while the jobs are being fetched
   }
 
   if (error) {
     return <div>{error}</div>; // Show an error message if fetching fails
   }
 
   
  return (
    <Layout>

      <AllJobs jobs={jobs} categoryId={categoryId}/>

      {/* <Container style={{ marginTop: '70px', marginBottom: '0.7rem' }}>
        <Row className="mb-4">
          <Col md={12}>
            <Form>
              <Row className="align-items-center mb-2">
                <Col md={2}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search jobs..."
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Location"
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select aria-label="Job Type">
                    <option value="">Job Type</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select aria-label="Skills">
                    <option value="">Select Skills</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="react">React</option>
                    <option value="nodejs">Node.js</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="Salary"
                      aria-label="Salary"
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button variant="primary" type="submit" className="w-100">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-2">Available Jobs</h4>
                <AllJobList jobs={jobs} onJobSelect={setSelectedJob} />
              </Card.Body>
            </Card>
          </Col>

          <Col md={7}>
            {selectedJob ? (
              <JobPreview job={selectedJob} />
            ) : (
              <Card className="shadow-sm">
                <Card.Body className="text-center">
                  <h5>Select a job to preview details</h5>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container> */}

    </Layout>
  );
};

export default JobByCategories;
