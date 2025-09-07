'use client';

import React, { useEffect, useState, useRef } from 'react';
import RecruiterCard from './RecruiterCard'; // Import the RecruiterCard component
import { Container, Spinner } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Icons for arrows

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const FeaturedRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoading(true);

      const cacheKey = 'recruiters';
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
          setRecruiters(parsedData.data);
          setLoading(false);
          return;
        }
      }

      try {
        // Fetch from your Next.js API route
        const res = await fetch('/api/employers'); // <-- Adjust path if needed
        if (!res.ok) {
          throw new Error('Failed to fetch recruiters');
        }
        const data = await res.json();

        setRecruiters(data);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Error fetching recruiters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Container>
      <div className="row text-center mt-5">
        <div className="col-lg-12 d-flex align-items-center mb-3">
          <h2 className="m-0 m-font-size1 mpt-20" style={{ fontSize: '30px' }}>
            Featured Recruiters
          </h2>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="scroll-container">
            <button
              className="scroll-button left"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="recruiter-list" ref={scrollContainerRef}>
              {recruiters.map((recruiter) => (
                <RecruiterCard
                  key={recruiter.id}
                  imgSrc={recruiter.logo}
                  altText={recruiter.company_name}
                  link={`employer/profile/${recruiter.id}`}
                  title={recruiter.company_name}
                />
              ))}
            </div>

            <button
              className="scroll-button right"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .scroll-container {
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .scroll-button {
          background: none;
          border: none;
          position: absolute;
          z-index: 10;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 50px;
          color: #555;
          transition: color 0.3s;
        }

        .scroll-button:hover {
          color: #000;
        }

        .scroll-button.left {
          left: 0;
        }

        .scroll-button.right {
          right: 0;
        }

        .recruiter-list {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
        }

        .recruiter-list::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }

        .recruiter-list > * {
          flex: 0 0 auto;
          margin-right: 20px;
        }
      `}</style>
    </Container>
  );
};

export default FeaturedRecruiters;
