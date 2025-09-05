import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import EmployerLayout from "../Layout/EmployerLayout";
const EditProfileForm = () => {
  return (
    <EmployerLayout>
      <Container>
      <Row>
       
        <Col md={12}>
          <Card >
            <Card.Header>
              <h1 className="mb-1">Edit Profile</h1>
              <div className="small">
                Already a Member? <a href="https://ejobsitesoftware.com/jobboard_demo/login.php?u=1">Sign In</a>
              </div>
            </Card.Header>
            <Card.Body className="card-body-custom">
              <Form>
                <Form.Text className="label-text">Personal Details</Form.Text>
                <Form.Control
                  type="text"
                  name="TREF_email_address"
                  value="demo1@aynsoft.com"
                  placeholder="Email Address"
                  className="mb-2"
                  disabled
                />
                <Form.Control
                  type="hidden"
                  name="TREF_email_address"
                  value="demo1@aynsoft.com"
                />

                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      name="TR_first_name"
                      value="Sophia"
                      placeholder="First name"
                      className="mb-2"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="TR_last_name"
                      value="Martin"
                      placeholder="Last name"
                      className="mb-2"
                    />
                  </Col>
                </Row>

                <Form.Text className="label-text">Company Details</Form.Text>
                <Form.Control
                  type="text"
                  name="TR_position"
                  value="Metagrowth Digital"
                  placeholder="Your Position"
                  className="mb-2"
                />
                <Form.Control
                  type="text"
                  name="TR_company_name"
                  value="Metagrowth Digital"
                  placeholder="Company Name"
                  className="mb-2"
                />
                <Form.Control
                  as="textarea"
                  name="TR_address_line1"
                  wrap="soft"
                  cols="45"
                  rows="3"
                  id="TR_address_line1"
                  placeholder="Full address"
                  className="mb-2"
                >
                  https://metagrowthdigital.com/
                </Form.Control>

                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      name="city"
                      value="london"
                      placeholder="City/town"
                      className="mb-2"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      name="TR_zip_code"
                      value="E6 2JA"
                      placeholder="Zip"
                      className="mb-2"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Select name="TR_country" className="mb-2">
                      <option value="">Please select a country...</option>
                      <option value="1">Afghanistan</option>
                      <option value="2">Albania</option>
                      <option value="3">Algeria</option>
                      <option value="4">American Samoa</option>
                      <option value="5">Andorra</option>
                      <option value="6">Angola</option>
                      <option value="7">Anguilla</option>
                      <option value="8">Antarctica</option>
                      <option value="9">Antigua and Barbuda</option>
                      <option value="10">Argentina</option>
                      {/* Add more countries as needed */}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      name="TR_telephone_number"
                      value="7451234311"
                      id="TR_telephone_number"
                      placeholder="Telephone Number"
                      className="mb-2"
                      autoComplete="off"
                    />
                  </Col>
                </Row>

                <Form.Text className="label-text">Company Logo</Form.Text>
                <Form.Text id="emailHelp" className="text-muted font-14 pt-2">
                  <Form.Control
                    type="file"
                    name="my_photo"
                    className="mb-2"
                  />
                  &nbsp;&nbsp;[&nbsp;&nbsp;<a href="#" onClick={() => alert('Preview functionality not implemented')} className="label">Preview</a>&nbsp;&nbsp;]
                  <br />
                  <span className="m-display-table" style={{ color: '#808080', display: 'block', fontSize: '12px', marginTop: '5px' }}>
                    Upload: gif, jpg, jpeg, png format
                  </span>
                </Form.Text>

                <Form.Check
                  type="checkbox"
                  name="newsletter"
                  value="Yes"
                  defaultChecked
                  label="Newsletter"
                  className="my-3"
                />

                <Form.Text id="emailHelp" className="text-muted font-14">
                  By continuing, you acknowledge that you accept our <a href="https://ejobsitesoftware.com/jobboard_demo/terms.php"> Terms & Conditions </a>
                  and <a href="https://ejobsitesoftware.com/jobboard_demo/privacy.php"> Privacy Policy </a>
                </Form.Text>
              </Form>
            </Card.Body>
            <Card.Footer className="bg-white card-footer-custom">
              <div className="text-center">
                <Button variant="primary" type="submit" className="w-100">
                  Update
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
    </EmployerLayout>
    
  );
};

export default EditProfileForm;
