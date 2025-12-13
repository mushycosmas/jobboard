'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RecruiterCard = ({ imgSrc, altText, link, title }) => {
  const [hovered, setHovered] = useState(false);

  // Ensure a valid logo URL
  let logoUrl = '/default-logo.png';
  if (imgSrc && imgSrc !== 'NILL') {
    logoUrl = `/uploads/${imgSrc.replace(/\\/g, '/')}`;
  }

  // Ensure link is valid for Next.js Link
  const safeLink = link || '#';

  return (
    <div className="col-6 col-sm-3 col-md-2 col-lg-2 col-xl-2 mb-4">
      <div className="card h-100 border-0 rounded-lg shadow-sm">
        <Link href={safeLink} className="d-flex justify-content-center align-items-center p-4">
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: '100%',
              maxWidth: '150px',
              height: 'auto',
              borderRadius: '50%',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, filter 0.3s ease',
              transform: hovered ? 'translateY(-5px)' : 'none',
              filter: hovered ? 'brightness(1.2)' : 'brightness(1)',
            }}
          >
            <Image
              src={logoUrl}
              alt={altText || 'Company Logo'}
              title={title || 'Company'}
              width={150}
              height={150}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecruiterCard;
