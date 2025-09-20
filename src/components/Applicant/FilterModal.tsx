import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const FilterModal = ({
  filters,
  handleFilterChange,
  handleFilterSubmit,
  handleFilterReset,
  countries,
  states,
  genders,
  experiences,
  maritalStatus,
  setShowFilterModal,
}) => {
  // Dropdown filter fields
  const dropdownFields = [
    { label: "Country", name: "country_id", options: countries },
    { label: "Region", name: "region_id", options: states },
    { label: "Gender", name: "gender_id", options: genders },
    { label: "Experience", name: "experience_id", options: experiences },
    { label: "Marital Status", name: "marital_id", options: maritalStatus },
  ];

  // Text filter fields
  const textFields = [
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Email", name: "email" },
  ];

  return (
    <Modal show onHide={() => setShowFilterModal(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Applicants</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-3">
          {/* Dropdown fields */}
          {dropdownFields.map(({ label, name, options }) => (
            <Col sm={6} lg={4} key={name}>
              <Form.Group controlId={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Select
                  name={name}
                  value={filters[name]}
                  onChange={handleFilterChange}
                >
                  <option value="">Select {label}</option>
                  {options?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          ))}

          {/* Text fields */}
          {textFields.map(({ label, name }) => (
            <Col sm={6} lg={4} key={name}>
              <Form.Group controlId={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="text"
                  name={name}
                  value={filters[name]}
                  onChange={handleFilterChange}
                  placeholder={`Enter ${label}`}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleFilterReset}>
          Reset
        </Button>
        <Button variant="primary" onClick={handleFilterSubmit}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
