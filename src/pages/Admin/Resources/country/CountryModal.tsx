import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Country } from "./CountryService";

interface Props {
  show: boolean;
  onHide: () => void;
  country: Country;
  setCountry: (country: Country) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CountryModal: React.FC<Props> = ({ show, onHide, country, setCountry, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{country?.id ? "Edit Country" : "Add Country"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={country?.name || ""}
              onChange={(e) => setCountry({ ...country, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              value={country?.country_code || ""}
              onChange={(e) => setCountry({ ...country, country_code: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Control
              type="text"
              value={country?.currency || ""}
              onChange={(e) => setCountry({ ...country, currency: e.target.value })}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            {country?.id ? "Update" : "Add"} Country
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CountryModal;
