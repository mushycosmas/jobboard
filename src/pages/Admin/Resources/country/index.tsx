"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import CountryTable from "./CountryTable";
import CountryModal from "./CountryModal";
import {
  Country,
  getCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from "./CountryService";

const CountryIndex: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country>({
    name: "",
    country_code: "",
    currency: "",
  });

  // Fetch countries
  const loadCountries = async () => {
    setLoading(true);
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  // Handle add or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCountry.id) {
        await updateCountry(currentCountry.id, currentCountry);
      } else {
        await addCountry(currentCountry);
      }
      setShowModal(false);
      setCurrentCountry({ name: "", country_code: "", currency: "" });
      loadCountries();
    } catch (err) {
      console.error("Error saving country:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this country?")) {
      try {
        await deleteCountry(id);
        loadCountries();
      } catch (err) {
        console.error("Error deleting country:", err);
      }
    }
  };

  // Handle edit
  const handleEdit = (country: Country) => {
    setCurrentCountry(country);
    setShowModal(true); // ✅ Open modal on edit
  };

  // Handle add new
  const handleAddNew = () => {
    setCurrentCountry({ name: "", country_code: "", currency: "" });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header>
            <h4>Manage Countries</h4>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <Button variant="success" className="mb-3" onClick={handleAddNew}>
                Add Country
              </Button>

              <CountryTable
                countries={countries}
                onEdit={handleEdit} // ✅ Use handleEdit
                onDelete={handleDelete}
              />
            </Card.Body>
          )}
        </Card>

        <CountryModal
          show={showModal}
          onHide={() => setShowModal(false)}
          country={currentCountry}
          setCountry={setCurrentCountry}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default CountryIndex;
