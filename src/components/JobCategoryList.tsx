'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import JobCategoryCard from './JobCategoryCard';
import Link from 'next/link';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Define the category type
interface Category {
  id: number;
  category: string;
  slug: string;
  job_count: number;
}

// Type for grouped categories
type CategoryGroup = Category[][];

const JobCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryGroup>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const cacheKey = 'job_categories';
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
          setCategories(parsedData.data);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch('/api/industries');
        if (!res.ok) throw new Error('Failed to fetch industries');

        const data: Category[] = await res.json();
        const grouped = groupCategories(data);
        setCategories(grouped);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: grouped, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Error fetching industries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Group categories in chunks of 3
  const groupCategories = (data: Category[]): CategoryGroup => {
    const chunkSize = 3;
    const result: CategoryGroup = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="mt-5">
      <Row className="mb-3 d-flex align-items-center">
        <Col>
          <h2 className="fw-bold" style={{ fontSize: '30px' }}>
            Jobs by Categories
          </h2>
        </Col>
        <Col className="d-flex justify-content-end">
          <Link href="/all-industries" className="btn btn-outline-secondary">
            All Industry
          </Link>
        </Col>
      </Row>

      <Row>
        {categories.map((group, index) => (
          <Col md={4} key={index}>
            <div className="categories my-2">
              {group.map((category) => (
                <JobCategoryCard
                  key={category.id}
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
