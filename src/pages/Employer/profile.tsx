"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
} from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Image,
  Spinner,
  Form,
  Button,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { UniversalDataContext } from "@/context/UniversalDataContext";

interface EmployerProfile {
  id: number;
  company_name?: string;
  logo?: string;
  address?: string;
  phonenumber?: string;
  company_size?: string;
  employer_email?: string;
  aboutCompany?: string;
  website?: string;
  region_name?: string;
  industry_name?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

const EmployerProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const { states, categories } = useContext(UniversalDataContext);

  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    if (!session?.user?.employerId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const employerId = session.user.employerId;

        const res = await fetch(`/api/employer/profile/${employerId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
        setLogoUrl(`/uploads/${data.logo || "default-company.png"}`);
      } catch (error) {
        console.error("Error fetching employer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile!, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const formData = new FormData();
      for (const key in profile) {
        formData.append(key, (profile as any)[key] || "");
      }
      if (logoFile) formData.append("logo", logoFile);

      const res = await fetch(`/api/employer/profile/${profile.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setProfile(updated);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading")
    return (
      <EmployerLayout>
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" />
        </div>
      </EmployerLayout>
    );

  if (!profile)
    return (
      <EmployerLayout>
        <p className="text-center mt-5">Employer profile not found.</p>
      </EmployerLayout>
    );

  return (
    <EmployerLayout>
      <Container className="mt-4">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">My Profile</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <Image
                    src={logoUrl}
                    roundedCircle
                    width={120}
                    height={120}
                    alt="Company Logo"
                  />
                  <Form.Group controlId="logo" className="mt-2">
                    <Form.Label>Change Logo</Form.Label>
                    <Form.Control type="file" onChange={handleLogoChange} />
                  </Form.Group>
                </Col>

                <Col md={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      name="company_name"
                      value={profile.company_name || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="employer_email"
                      value={profile.employer_email || ""}
                      onChange={handleChange}
                      type="email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      name="phonenumber"
                      value={profile.phonenumber || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Company Size</Form.Label>
                    <Form.Control
                      name="company_size"
                      value={profile.company_size || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      name="website"
                      value={profile.website || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Industry</Form.Label>
                    <Form.Select
                      name="industry_name"
                      value={profile.industry_name || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Industry</option>
                      {categories?.map((i: any) => (
                        <option key={i.id} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Region</Form.Label>
                    <Form.Select
                      name="region_name"
                      value={profile.region_name || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Region</option>
                      {states?.map((r: any) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>About Company</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="aboutCompany"
                      value={profile.aboutCompany || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                      name="twitter"
                      value={profile.twitter || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      name="facebook"
                      value={profile.facebook || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      name="linkedin"
                      value={profile.linkedin || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </EmployerLayout>
  );
};

export default EmployerProfilePage;
