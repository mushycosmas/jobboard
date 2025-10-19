import React from 'react';
import Layout from './AdminLayout/Layout';
import { Container ,Row,Col} from 'react-bootstrap';
const Dashboard = () => {
  return (
    <Layout>
        <Container>
            <Row>
                
         <Col> <div className="content">
        <h2>Dashboard</h2>
        <p>Welcome to the admin dashboard. Here you can manage jobs, users, and view system statistics.</p>
      </div></Col>
            </Row>
        </Container>
     
    </Layout>
  );
};

export default Dashboard;
