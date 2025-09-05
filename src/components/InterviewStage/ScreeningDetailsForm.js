import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ScreeningDetailsForm = ({
  show,
  onClose,
  onSubmit,
  screeningDetails = {},
  setScreeningDetails,
}) => {

    const staticScreeners = [
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Bob Smith' },
        { id: 3, name: 'Carol Lee' },
      ];
      
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreeningDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Screening Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            {/* Screener (Static Users) */}
<Form.Group controlId="screeningScreener" className="mb-3">
  <Form.Label>Screener</Form.Label>
  <Form.Select
    name="screener_id"
    value={screeningDetails.screener_id || ''}
    onChange={handleChange}
    required
  >
    <option value="">Select screener</option>
    {staticScreeners.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    ))}
  </Form.Select>
</Form.Group>

          {/* Method (Screening Type) */}
          <Form.Group controlId="screeningMethod" className="mb-3">
            <Form.Label>Screening Method</Form.Label>
            <Form.Select
              name="method"
              value={screeningDetails.method || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select method</option>
              <option value="Phone">Phone</option>
              <option value="Resume">Resume</option>
              <option value="Background Check">Background Check</option>
            </Form.Select>
          </Form.Group>

          {/* Outcome */}
          <Form.Group controlId="screeningOutcome" className="mb-3">
            <Form.Label>Outcome</Form.Label>
            <Form.Select
              name="outcome"
              value={screeningDetails.outcome || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select outcome</option>
              <option value="Clear">Clear</option>
              <option value="Flagged">Flagged</option>
              <option value="Pending">Pending</option>
            </Form.Select>
          </Form.Group>

          {/* Notes */}
          <Form.Group controlId="screeningNotes" className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={screeningDetails.notes || ''}
              onChange={handleChange}
              placeholder="Any additional comments"
              rows={3}
            />
          </Form.Group>

          {/* Follow-up Action (optional, not stored in table but useful for next step logic) */}
          <Form.Group controlId="followUpAction" className="mb-3">
            <Form.Label>Follow-up Action</Form.Label>
            <Form.Select
              name="followUpAction"
              value={screeningDetails.followUpAction || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select action</option>
              <option value="move_to_interview">Move to Interview</option>
              <option value="move_to_assessment">Move to Assessment</option>
              <option value="reject">Reject</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Save & Move
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScreeningDetailsForm;
