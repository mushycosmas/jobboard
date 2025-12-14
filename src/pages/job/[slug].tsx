import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import JobDetails from '@/components/JobDetails';  // Adjust the path based on your folder structure
import Layout from '../../components/Layout'; // Adjust this path if needed

interface Job {
  id: number;
  slug: string;
  title: string;
  company_name: string;
  address: string;
  description: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('http://localhost:3000/api/jobs');
  const jobs: Job[] = await res.json();

  const paths = jobs.map((job) => ({
    params: { slug: job.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Enables on-demand rendering
  };
};

export const getStaticProps: GetStaticProps<{ job: Job }> = async ({ params }) => {
  const slug = params?.slug;

  const res = await fetch(`http://localhost:3000/api/jobs/${slug}`);
  if (!res.ok) {
    return { notFound: true };
  }

  const job: Job = await res.json();

  return {
    props: { job },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

const JobDetailPage = ({ job }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Head>
      <title>{`${job.title} at ${job.company_name}`}</title>

        <meta name="description" content={job.description?.substring(0, 150) || ''} />
        <link rel="canonical" href={`http://localhost:3000/job/${job.slug}`} />
      </Head>

      <div className="container ">
        <JobDetails job={job} />
      </div>
    </Layout>
  );
};

export default JobDetailPage;
