"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { UniversalDataContext } from "@/context/UniversalDataContext";
import SocialMediaTable, { SocialMediaData } from "./SocialMediaTable";
import AddSocialMediaModal from "./AddSocialMediaModal";

const API_BASE_URL = "/api/applicant/social-media";

const SocialMediaComponent: React.FC = () => {
  const { socialMedias: availableSocialMedia } = useContext(UniversalDataContext);
  const { data: session, status } = useSession();

  const [savedLinks, setSavedLinks] = useState<SocialMediaData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialMediaData | null>(null);
  const [applicantId, setApplicantId] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.applicantId) {
      setApplicantId(session.user.applicantId.toString());
    }
  }, [session, status]);

  const fetchLinks = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${applicantId}`);
      if (!res.ok) throw new Error("Failed to fetch social media links");
      const data = await res.json();
      setSavedLinks(data);
    } catch (err) {
      console.error(err);
      setSavedLinks([]);
    }
  };

  useEffect(() => {
    if (applicantId) fetchLinks();
  }, [applicantId]);

  const handleAdd = () => {
    setEditingLink(null);
    setShowModal(true);
  };

  const handleEdit = (link: SocialMediaData) => {
    setEditingLink(link);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!applicantId) return;
    if (!confirm("Are you sure you want to delete this social media link?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${applicantId}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await fetchLinks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete link: " + (err as Error).message);
    }
  };

  const handleSave = async (social_media_id: number | string, url: string) => {
    if (!applicantId) return;
    try {
      const payload = editingLink
        ? { id: editingLink.id, social_media_id, url }
        : { social_media_id, url };

      const method = editingLink ? "PUT" : "POST";

      const res = await fetch(`${API_BASE_URL}/${applicantId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchLinks();
      setShowModal(false);
      setEditingLink(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save link: " + (err as Error).message);
    }
  };

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please log in to manage social media links.</div>;

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">Applicant Social Media</h5>
        <Button variant="light" onClick={handleAdd}>Add Link</Button>
      </Card.Header>
      <Card.Body>
        <SocialMediaTable
          socialMediaLinks={savedLinks} // fixed prop name
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card.Body>

      <AddSocialMediaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        availableSocialMedia={availableSocialMedia}
        editingLink={editingLink}
      />
    </Card>
  );
};

export default SocialMediaComponent;
