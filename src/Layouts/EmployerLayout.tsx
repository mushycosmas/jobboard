// AdminLayout.js
import React from 'react';
import EmployerHeader from '../components/Employer/Partial/EmployerHeader';
import EmployerSidebar from '../components/Employer/Partial/EmployerSidebar';
import {Row,Col,Container} from 'react-bootstrap';
import UniversalDataProvider from '../context/UniversalDataContext';
const EmployerLayout = ({ children }) => {
  return (
    <UniversalDataProvider>
    <EmployerHeader/>
    <Container style={{marginTop:"4rem", marginBottom: "2rem"}}>
    <Row>
      <Col md={3}>
      <EmployerSidebar/>
      </Col>
      <Col md="9">
      <main className="main-content">
      {children}
        </main>
      </Col>
    </Row>
    </Container>
    
  </UniversalDataProvider>
  );
};

export default EmployerLayout;
