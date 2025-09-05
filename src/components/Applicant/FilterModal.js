import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

const FilterModal = ({ filters, handleFilterChange, handleFilterSubmit, handleFilterReset, countries, states, genders, experiences, maritalStatus, setShowFilterModal }) => {
    return (
      <Modal show={true} onHide={() => setShowFilterModal(false)}> {/* Close modal on hide */}
        <Modal.Header closeButton>
          <Modal.Title>Filter Applicants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {[ 
              { label: 'Country', name: 'country_id', options: countries },
              { label: 'Region', name: 'region_id', options: states },
              { label: 'Gender', name: 'gender_id', options: genders },
              { label: 'Experience', name: 'experience_id', options: experiences },
              { label: 'Marital Status', name: 'marital_id', options: maritalStatus },
            ].map(({ label, name, options }) => (
              <Col sm={6} lg={4} key={name}>
                <label htmlFor={name}>{label}</label>
                <select
                  id={name}
                  name={name}
                  className="form-control"
                  value={filters[name]}
                  onChange={handleFilterChange}
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Col>
            ))}
            {[ 
              { label: 'First Name', name: 'first_name' },
              { label: 'Last Name', name: 'last_name' },
              { label: 'Email', name: 'email' },
            ].map(({ label, name }) => (
              <Col sm={6} lg={4} key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  type="text"
                  id={name}
                  name={name}
                  className="form-control"
                  value={filters[name]}
                  onChange={handleFilterChange}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFilterReset}>Reset</Button>
          <Button variant="primary" onClick={handleFilterSubmit}>Apply Filters</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  

export default FilterModal;
