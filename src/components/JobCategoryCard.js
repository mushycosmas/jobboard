'use client';

import React from 'react';
import Link from 'next/link';

const JobCategoryCard = ({ name, id, count, slug }) => {
  return (
    <div className="my-2">
      <Link href={`/category/${slug}/${id}`} title={name} className="text-decoration-none">
        {name}
      </Link>{' '}
      ({count})
    </div>
  );
};

export default JobCategoryCard;
