import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Region, Country } from "./LocationService";

interface Props {
  show: boolean;
  onHide: () => void;
  region: Region;
  setRegion: (region: Region) => void;
  onSubmit: (e: React.FormEvent) => void;
  countries?: Country[]; // optional to avoid undefined errors
}

const RegionModal: React.FC<Props> = ({
  show,
  onHide,
  region,
  setRegion,
  onSubmit,
  countries = [], // default empty array
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{region?.id ? "Edit Region" : "Add Region"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={onSubmit}>
          {/* Country Select */}
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Select
              value={region?.country_id || ""}
              onChange={(e) =>
                setRegion({ ...region, country_id: Number(e.target.value) })
              }
              required
            >
              <option value="">-- Select Country --</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Region Name */}
          <Form.Group className="mb-3">
            <Form.Label>Region Name</Form.Label>
            <Form.Control
              type="text"
              value={region?.name || ""} // ✅ changed from region_name to name
              onChange={(e) =>
                setRegion({ ...region, name: e.target.value }) // ✅ changed
              }
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            {region?.id ? "Update" : "Add"} Region
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegionModal;
