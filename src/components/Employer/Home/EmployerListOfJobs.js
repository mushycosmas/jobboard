import JobList from "../job/JobList";
import {  Container, Row, Col,} from 'react-bootstrap';
import React, { useState } from 'react';
import EmployerLayout from "../Layout/EmployerLayout";
const EmployerListOfJobs=()=>{

    const [selectedJobId, setSelectedJobId] = useState(null);

    const jobs = [
      { id: 1, title: 'Software Engineer', description: 'Develop software applications.', company: 'Tech Corp', location: 'San Francisco' },
      { id: 2, title: 'Product Manager', description: 'Manage product development.', company: 'Innovate Inc.', location: 'New York' },
      // Add more job objects as needed
    ];
  
    const handleView = (id) => {
      // Handle view action (e.g., navigate to a detail page)
      console.log('View job with ID:', id);
    };
  
    const handleEdit = (id) => {
      // Handle edit action (e.g., open an edit form)
      console.log('Edit job with ID:', id);
    };
  
    const handleDelete = (id) => {
      // Handle delete action (e.g., remove job from the list)
      console.log('Delete job with ID:', id);
    };
  
    const handleSelect = (id) => {
      // Handle select action (e.g., mark job as selected)
      setSelectedJobId(id);
      console.log('Selected job with ID:', id);
    };
  
    return (
        <EmployerLayout>
         <Container >
         <Row>
        <Col md={12}>
          <JobList 
            jobs={jobs} 
            onView={handleView} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onSelect={handleSelect} 
          />
          {selectedJobId && <p className="mt-3">Selected Job ID: {selectedJobId}</p>}
        </Col>
      </Row>
    </Container>
        </EmployerLayout> 
     
      
    );
  };
export default EmployerListOfJobs;