import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

// Static user list
const users = [
  { id: 1, name: 'Kelvin Cosmas' },
  { id: 2, name: 'John Doe' },
  { id: 3, name: 'Jane Smith' },
];

const AssessmentDetailsForm = ({
  show,
  onClose,
  onSubmit,
  assessmentDetails = {},
  setAssessmentDetails,
}) => {
  const [missingFields, setMissingFields] = useState([]);

  const requiredFields = ['type', 'date_taken', 'duration'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssessmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missing = requiredFields.filter(
      (field) => !assessmentDetails[field] || assessmentDetails[field].toString().trim() === ''
    );

    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    setMissingFields([]);
    onSubmit();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assessment Details</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {missingFields.length > 0 && (
            <Alert variant="danger">
              Please fill in all required fields: <strong>{missingFields.join(', ')}</strong>
            </Alert>
          )}

          <Form.Group controlId="assessmentType" className="mb-3">
            <Form.Label>Assessment Type *</Form.Label>
            <Form.Select
              name="type"
              value={assessmentDetails.type || ''}
              onChange={handleChange}
              isInvalid={missingFields.includes('type')}
            >
              <option value="">Select Type</option>
              <option value="Technical">Technical</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Personality">Personality</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="assessmentScore" className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="text"
              name="score"
              value={assessmentDetails.score || ''}
              onChange={handleChange}
              placeholder="e.g. 85%"
            />
          </Form.Group>

          <Form.Group controlId="assessmentDuration" className="mb-3">
            <Form.Label>Duration (minutes) *</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={assessmentDetails.duration || ''}
              onChange={handleChange}
              isInvalid={missingFields.includes('duration')}
              placeholder="e.g. 60"
            />
          </Form.Group>

          <Form.Group controlId="evaluatorId" className="mb-3">
            <Form.Label>Evaluator</Form.Label>
            <Form.Select
              name="evaluator_id"
              value={assessmentDetails.evaluator_id || ''}
              onChange={handleChange}
            >
              <option value="">Select Evaluator</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="assessmentNotes" className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={assessmentDetails.notes || ''}
              onChange={handleChange}
              placeholder="Add any relevant notes"
            />
          </Form.Group>

          <Form.Group controlId="assessmentDateTaken" className="mb-3">
            <Form.Label>Date Taken *</Form.Label>
            <Form.Control
              type="date"
              name="date_taken"
              value={assessmentDetails.date_taken || ''}
              onChange={handleChange}
              isInvalid={missingFields.includes('date_taken')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save & Move</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AssessmentDetailsForm;
