'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const RecruiterCard = ({ imgSrc, altText, link, title }) => {
  const styles = {
    theme1FeaturedLogo: {
      width: '100%',
      maxWidth: '150px',
      height: 'auto',
      objectFit: 'contain',
      borderRadius: '50%',
      transition: 'transform 0.3s ease, filter 0.3s ease',
    },
    theme1FeaturedLogoHover: {
      transform: 'translateX(20px)',
      filter: 'brightness(1.2)',
    },
  };

  const [hovered, setHovered] = useState(false);

  return (
    <div className="col-6 col-sm-3 col-md-2 col-lg-2 col-xl-2 mb-4">
      <div className="card h-100 border-0 rounded-lg shadow-sm">
        <Link href={link} passHref legacyBehavior>
          <a>
            <div className="d-flex justify-content-center align-items-center p-4">
              <img
                src={imgSrc ? `http://localhost:4000${imgSrc}` : 'https://via.placeholder.com/100'}
                alt={altText}
                title={title}
                className="card-img-top theme1-featured-logo"
                style={{
                  ...styles.theme1FeaturedLogo,
                  ...(hovered ? styles.theme1FeaturedLogoHover : {}),
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              />
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default RecruiterCard;
