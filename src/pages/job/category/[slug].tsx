import React from 'react';
import JobCategoriesList from '@/components/Job/JobCategoriesList'; // Ensure the import path is correct
import Layout from '../../../components/Layout'; // Adjust this path based on your actual folder structure

interface Job {
  id: number;
  title: string;
  company_name: string;
  // Add other properties you might need for the job
}

interface Props {
  jobs: Job[];
  categorySlug: string;
}

export async function getServerSideProps(context: { params: { slug: string } }) {
  const { slug } = context.params;

  try {
    const res = await fetch(`http://localhost:3000/api/categories/${slug}`);

    if (!res.ok) {
      // Handle failed response gracefully (e.g., API might be down or slug doesn't exist)
      return { notFound: true };  // Redirect to 404 page if the category is not found
    }

    const jobs: Job[] = await res.json();

    return {
      props: {
        jobs,
        categorySlug: slug,
      },
    };
  } catch (error) {
    // Handle fetch error (e.g., network issues)
    console.error('Error fetching category data:', error);
    return { notFound: true }; // Show a 404 page in case of an error
  }
}

const CategoryPage: React.FC<Props> = ({ jobs}) => {
  return (
    <Layout>
      <div className="container mt-4">
        {/* Ensure JobCategoriesList component properly handles the "jobs" prop */}
        <JobCategoriesList jobs={jobs} />
      </div>
    </Layout>
  );
};

export default CategoryPage;
