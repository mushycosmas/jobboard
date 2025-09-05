import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import CandidateForm from './CandidateForm';
import EmployerForm from './EmployerForm';

const RegistrationTabs = () => {
  const [key, setKey] = useState('candidate');

  return (
    <Container className="my-5"> {/* Margin for spacing */}
      <h2 className="text-center mb-4">Registration</h2>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4" // Margin bottom for the tabs
      >
        <Tab eventKey="candidate" title="Candidate">
          <CandidateForm />
        </Tab>
        <Tab eventKey="employer" title="Employer">
          <EmployerForm />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default RegistrationTabs;
