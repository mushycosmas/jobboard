'use client';

import React from 'react';
import Link from 'next/link';

interface JobCategoryCardProps {
  name: string;
  id: number;
  count: number;
  slug: string;
}

const JobCategoryCard: React.FC<JobCategoryCardProps> = ({ name, count, slug }) => {
  return (
    <div className="my-2">
      <Link
        href={`/job/category/${slug}`}
        title={name}
        className="text-decoration-none text-primary fw-semibold"
      >
        {name}
      </Link>{' '}
      <span className="text-muted">({count})</span>
    </div>
  );
};

export default JobCategoryCard;
