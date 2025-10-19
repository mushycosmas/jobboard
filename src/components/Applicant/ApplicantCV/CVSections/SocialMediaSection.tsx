"use client";

import React from "react";

interface SocialMediaItem {
  platform_name: string;
  url: string;
}

interface SocialMediaProps {
  socialMediaLinks: SocialMediaItem[];
}

const SocialMediaSection: React.FC<SocialMediaProps> = ({ socialMediaLinks }) => {
  return (
    <div className="social-media-section mb-3">
      <h3>Social Media</h3>
      <ul>
        {socialMediaLinks.map((link, idx) => (
          <li key={idx}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.platform_name}
            </a>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default SocialMediaSection;
