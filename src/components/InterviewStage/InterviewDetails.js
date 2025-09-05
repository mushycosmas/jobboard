import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InterviewDetails = ({
  show,
  onClose,
  onSubmit,
  interviewDetails,
  setInterviewDetails,
}) => {
  // Static data for interviewers
  const interviewers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterviewDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Interview Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="interviewType" className="mb-3">
            <Form.Label>Interview Type</Form.Label>
            <Form.Select
  name="type"
  value={interviewDetails.type || ''}
  onChange={handleChange}
  required
>
  <option value="">Select Type</option>
  <option value="Phone">Phone</option>
  <option value="Zoom">Zoom</option>
  <option value="In-person">In-Person</option>
</Form.Select>

          </Form.Group>

          <Form.Group controlId="interviewerId" className="mb-3">
            <Form.Label>Interviewer</Form.Label>
            <Form.Select
              name="interviewer_id"
              value={interviewDetails.interviewer_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Interviewer</option>
              {interviewers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="interviewDate" className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={interviewDetails.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="interviewTime" className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={interviewDetails.time}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="interviewDuration" className="mb-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              value={interviewDetails.duration || ''}
              onChange={handleChange}
              placeholder="e.g. 1 hour"
              required
            />
          </Form.Group>

          <Form.Group controlId="interviewLocation" className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="venue"
              value={interviewDetails.venue}
              onChange={handleChange}
              placeholder="e.g. Zoom link or office address"
              required
            />
          </Form.Group>

          <Form.Group controlId="interviewNote" className="mb-3">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={interviewDetails.notes || ''}
              onChange={handleChange}
              placeholder="e.g. Bring portfolio, wear formal attire"
              rows={3}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit}>Save & Move</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InterviewDetails;
