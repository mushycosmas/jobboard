'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import JobCategoryCard from './JobCategoryCard'; // Import JobCategoryCard
import { fetchAllIndustry } from '../api/api'; // Your API fetch function
import Link from 'next/link';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const JobCategoryList = () => {
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);

      const cacheKey = 'job_categories';
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);

        // Check if cache is valid
        if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
          setCategories(parsedData.data);
          setLoading(false);
          return;
        }
      }

      try {
        // Fetch fresh data
        const data = await fetchAllIndustry();
        const groupedCategories = groupCategories(data);
        setCategories(groupedCategories);

        // Cache with timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: groupedCategories, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Error fetching industries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Group categories into chunks of 3
  const groupCategories = (data) => {
    const chunkSize = 3;
    return data.reduce((result, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    }, []);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      {/* Categories Section */}
      <Row className="mb-3 d-flex align-items-center">
        <Col>
          <h2 style={{ fontSize: '30px' }}>Jobs by Categories</h2>
        </Col>
        <Col className="d-flex justify-content-end">
          <Link href="/home/all-category" passHref legacyBehavior>
            <a className="btn btn-text border">All Industry</a>
          </Link>
        </Col>
      </Row>

      {/* Job Categories */}
      <Row>
        {categories.map((categoryGroup, index) => (
          <Col md={4} key={index}>
            <div className="categories my-2">
              {categoryGroup.map((category, idx) => (
                <JobCategoryCard
                  key={idx}
                  name={category.category}
                  id={category.id}
                  slug={category.slug}
                  count={category.job_count}
                />
              ))}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default JobCategoryList;
