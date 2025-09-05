"use client";

import React, { useState, useEffect, useContext } from "react";
import ApplicantLayout from "@/components/Applicant/Partial/ApplicantLayout";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { UniversalDataContext } from "@/context/UniversalDataContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PersonalDetails = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Wait for session to load
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const applicantId = session?.user?.applicantId || "";

  const [formData, setFormData] = useState({
    applicantId: applicantId,
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    city: "",
    contactNo: "",
    contactNo1: "",
    maritalStatus: "",
    gender: "",
    dateOfBirth: "",
    about: "",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const { countries, states, maritalStatus, genders } = useContext(UniversalDataContext);

  // Redirect to login if applicantId missing
  useEffect(() => {
    if (!applicantId) {
      setAlert({
        type: "danger",
        message: "Applicant ID is missing. Please log in again.",
      });
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [applicantId, router]);

  // Format date for input[type=date]
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch applicant data on mount and applicantId change
  useEffect(() => {
    if (!applicantId) return;

    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`/api/applicant/${applicantId}`);
        if (!response.ok) throw new Error("Failed to fetch applicant data.");

        const data = await response.json();

        setFormData({
          applicantId,
          firstName: data[0]?.first_name || "",
          lastName: data[0]?.last_name || "",
          address: data[0]?.address || "",
          country: data[0]?.country_id || "",
          city: data[0]?.region_id || "",
          contactNo: data[0]?.phone_number || "",
          contactNo1: data[1]?.phone_number || "",
          maritalStatus: data[0]?.marital_id || "",
          gender: data[0]?.gender_id || "",
          dateOfBirth: formatDate(data[0]?.dob || ""),
          about: data[0]?.about || "",
        });
        setCharCount(data[0]?.about?.length || 0);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        setAlert({
          type: "danger",
          message: "An error occurred while fetching your data. Please try again later.",
        });
      }
    };

    fetchApplicantData();
  }, [applicantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "about") {
      setCharCount(value.length);
    }
  };

  const validateForm = () => {
    const errors: any = {};
    const missingFields: string[] = [];
    let isValid = true;

    if (!formData.firstName) {
      errors.firstName = "First Name is required.";
      missingFields.push("First Name");
      isValid = false;
    }
    if (!formData.lastName) {
      errors.lastName = "Last Name is required.";
      missingFields.push("Last Name");
      isValid = false;
    }
    if (!formData.country) {
      errors.country = "Country is required.";
      missingFields.push("Country");
      isValid = false;
    }
    if (!formData.city) {
      errors.city = "City is required.";
      missingFields.push("City");
      isValid = false;
    }
    if (!formData.contactNo) {
      errors.contactNo = "Phone Number is required.";
      missingFields.push("Phone Number");
      isValid = false;
    } else if (!/^255\d{9}$/.test(formData.contactNo)) {
      errors.contactNo = "Phone Number must start with '255' and be 12 digits long.";
      isValid = false;
    }
    if (!formData.maritalStatus) {
      errors.maritalStatus = "Marital Status is required.";
      missingFields.push("Marital Status");
      isValid = false;
    }
    if (!formData.gender) {
      errors.gender = "Gender is required.";
      missingFields.push("Gender");
      isValid = false;
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required.";
      missingFields.push("Date of Birth");
      isValid = false;
    }
    if (!formData.about) {
      errors.about = "About You section is required.";
      missingFields.push("About You");
      isValid = false;
    } else if (formData.about.length > 500) {
      errors.about = "About You section cannot exceed 500 characters.";
      isValid = false;
    }

    setFormErrors(errors);
    return { isValid, missingFields };
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);

    const { isValid, missingFields } = validateForm();

    if (!isValid) {
      setAlert({
        type: "danger",
        message: `Please fill in the following required fields: ${missingFields.join(", ")}.`,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/applicant/${applicantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Your data has been updated successfully!",
        });
      } else {
        setAlert({
          type: "danger",
          message: result.message || "Failed to update data.",
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
      setAlert({
        type: "danger",
        message: "An error occurred while updating your data. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter cities by country
  const filteredCities = states.filter((state) => state.countryId === parseInt(formData.country));

  if (!applicantId) {
    return (
      <ApplicantLayout>
        <Alert variant="danger" className="text-center">
          Applicant ID is missing. Please log in again.
        </Alert>
      </ApplicantLayout>
    );
  }

  return (
    <ApplicantLayout>
      <Card className="mx-auto" style={{ maxWidth: "800px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Personal Details</Card.Title>

          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.firstName}
                  placeholder="Enter your first name"
                />
                <Form.Control.Feedback type="invalid">{formErrors.firstName}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  isInvalid={!!formErrors.lastName}
                  placeholder="Enter your last name"
                />
                <Form.Control.Feedback type="invalid">{formErrors.lastName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Country */}
          <Row className="mt-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="country"
                  value={formData.country}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, city: "" })); // reset city on country change
                  }}
                  isInvalid={!!formErrors.country}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.country}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* City */}
            <Col xs={12} md={6}>
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  isInvalid={!!formErrors.city}
                >
                  <option value="">Select city</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.city}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Contact Numbers */}
          <Row className="mt-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formContactNo">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  isInvalid={!!formErrors.contactNo}
                  placeholder="e.g. 2557xxxxxxxx"
                />
                <Form.Control.Feedback type="invalid">{formErrors.contactNo}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formContactNo1">
                <Form.Label>Alternate Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNo1"
                  value={formData.contactNo1}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Marital Status and Gender */}
          <Row className="mt-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formMaritalStatus">
                <Form.Label>Marital Status</Form.Label>
                <Form.Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  isInvalid={!!formErrors.maritalStatus}
                >
                  <option value="">Select marital status</option>
                  {maritalStatus.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.maritalStatus}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  isInvalid={!!formErrors.gender}
                >
                  <option value="">Select gender</option>
                  {genders.map((gender) => (
                    <option key={gender.id} value={gender.id}>
                      {gender.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.gender}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Date of Birth */}
          <Row className="mt-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formDateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  isInvalid={!!formErrors.dateOfBirth}
                />
                <Form.Control.Feedback type="invalid">{formErrors.dateOfBirth}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* About */}
          <Row className="mt-3">
            <Col xs={12}>
              <Form.Group controlId="formAbout">
                <Form.Label>About You</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  maxLength={500}
                  isInvalid={!!formErrors.about}
                  placeholder="Write about yourself (max 500 characters)"
                />
                <Form.Text>{charCount} / 500 characters</Form.Text>
                <Form.Control.Feedback type="invalid">{formErrors.about}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button variant="primary" onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Update Data"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </ApplicantLayout>
  );
};

export default PersonalDetails;
