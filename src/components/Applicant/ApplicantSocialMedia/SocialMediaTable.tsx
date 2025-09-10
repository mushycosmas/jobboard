"use client";

import React from "react";
import { Table, Button } from "react-bootstrap";

export interface SocialMediaData {
  id: number; // row ID from applicant_social_medias
  social_media_id?: number;
  social_media_name?: string;
  url: string;
}

interface Props {
  socialMediaLinks?: SocialMediaData[];
  onDelete: (id: number) => void;
  onEdit?: (link: SocialMediaData) => void;
}

const SocialMediaTable: React.FC<Props> = ({
  socialMediaLinks = [],
  onDelete,
  onEdit,
}) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Social Media</th>
          <th>URL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {socialMediaLinks.length > 0 ? (
          socialMediaLinks.map((link) => (
            <tr key={link.id}>
              <td>{link.social_media_name || "N/A"}</td>
              <td>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </td>
              <td>
                {onEdit && (
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(link)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(link.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center">
              No social media links found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default SocialMediaTable;
