import React from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import EmployerLayout from "../Layout/EmployerLayout";
const AddEditUser = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form validation logic here
  };

  return (
    <EmployerLayout>
      <Container>
      <Row>
        <Col md={12}>
          {/* Alert Message - adjust as needed */}
          <div className="alert-message">
            {/* Alert message content here */}
          </div>

          {/* Add/Edit User Card */}
          <Card className="card-custom">
            <Card.Header>
              <h1 className="main-heading">Add/Edit user</h1>
            </Card.Header>
            <Card.Body className="card-body-custom">
              <Form name="user" action="https://ejobsitesoftware.com/jobboard_demo/list_of_users.php" method="post" onSubmit={handleSubmit}>
                <Form.Control type="hidden" name="action" value="new" />

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>Full name :</Form.Label>
                  <Col sm={9}>
                    <Form.Control type="text" name="TR_full_name" size="40" className="required" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>E-Mail Address :</Form.Label>
                  <Col sm={9}>
                    <Form.Control type="text" name="TREF_email_address" size="40" className="required" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>Confirm E-Mail Address :</Form.Label>
                  <Col sm={9}>
                    <Form.Control type="text" name="TREF_confirm_email_address" size="40" className="required" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>Password :</Form.Label>
                  <Col sm={9}>
                    <Form.Control type="password" name="TR_password" className="required" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>Confirm Password :</Form.Label>
                  <Col sm={9}>
                    <Form.Control type="password" name="TR_confirm_password" className="required" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Col sm={3}></Col>
                  <Col sm={9}>
                    <Button type="submit" variant="primary">Add User</Button>
                  </Col>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {/* List of Users Card */}
          <Card className="card-custom mt-3">
            <Card.Header className="card-header-custom">
              <h4 className="">List of users</h4>
            </Card.Header>
            <Card.Body className="card-body-custom p-0">
              <Table hover className="table">
                <thead>
                  <tr className="jobs-table-headbar">
                    <th>Full name</th>
                    <th>Jobs</th>
                    <th className="m-none">Inserted</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div><a href="https://ejobsitesoftware.com/jobboard_demo/list_of_users.php?userID=1">bongo user</a></div>
                      <div>bongobas+user@gmail.com</div>
                    </td>
                    <td className="m-none">1</td>
                    <td className="m-none">12th Jul, 2021</td>
                    <td>
                   </td>
                    <td>
                     
                   </td>
                  </tr>
                  {/* Add more rows here */}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </EmployerLayout>
    
  );
};

export default AddEditUser;
