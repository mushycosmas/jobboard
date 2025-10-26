"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Form } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  Country,
  Region,
  getCountries,
  getRegionsByCountry,
  addRegion,
  updateRegion,
  deleteRegion,
} from "./LocationService";
import RegionTable from "./RegionTable";
import RegionModal from "./RegionModal";

const LocationIndex: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const [currentRegion, setCurrentRegion] = useState<Region>({
    id: undefined,
    name: "",
    country_id: 0,
  });

  // Load all countries
  const loadCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);

      // Automatically select first country and load its regions
      if (data.length > 0) {
        setSelectedCountry(data[0].id);
        loadRegions(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch countries:", err);
    }
  };

  // Load regions for a country
  const loadRegions = async (countryId: number) => {
    setLoading(true);
    try {
      const data = await getRegionsByCountry(countryId);
      setRegions(data);
    } catch (err) {
      console.error("Failed to fetch regions:", err);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry !== null) {
      loadRegions(selectedCountry);
    }
  }, [selectedCountry]);

  // Add/update region
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: currentRegion.name?.trim(),
      country_id: currentRegion.country_id,
    };

    if (!payload.name || !payload.country_id) {
      alert("Region name and country ID are required.");
      return;
    }

    try {
      if (currentRegion.id) {
        await updateRegion(currentRegion.id, payload);
      } else {
        await addRegion(payload);
      }

      setShowModal(false);
      setCurrentRegion({
        id: undefined,
        name: "",
        country_id: selectedCountry || 0,
      });

      if (selectedCountry) loadRegions(selectedCountry);
    } catch (err) {
      console.error("Error saving region:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this region?")) return;

    try {
      await deleteRegion(id);
      if (selectedCountry) loadRegions(selectedCountry);
    } catch (err) {
      console.error("Error deleting region:", err);
    }
  };

  const handleEdit = (region: Region) => {
    setCurrentRegion({
      id: region.id,
      name: region.name || "",
      country_id: region.country_id || selectedCountry || 0,
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    if (!selectedCountry) {
      alert("Please select a country first.");
      return;
    }

    setCurrentRegion({
      id: undefined,
      name: "",
      country_id: selectedCountry,
    });

    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h4>Manage Regions</h4>
              <Form.Select
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(Number(e.target.value))}
                style={{ width: "250px" }}
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <Button
                variant="success"
                className="mb-3"
                onClick={handleAddNew}
              >
                Add Region
              </Button>

              <RegionTable
                regions={regions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          )}
        </Card>

        <RegionModal
          show={showModal}
          onHide={() => setShowModal(false)}
          region={currentRegion}
          setRegion={setCurrentRegion}
          onSubmit={handleSubmit}
          countries={countries}
        />
      </div>
    </AdminLayout>
  );
};

export default LocationIndex;
