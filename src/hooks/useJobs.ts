"use client";

import { useState } from "react";

export interface Job {
  id?: number | string;
  title?: string;
  description?: string;
  [key: string]: any;
}

const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async (status: string = "all", employerId?: string | null) => {
  if (!employerId) return;
  try {
    const res = await fetch(`/api/job/get?status=${status}&employer_id=${employerId}`);
    const data = await res.json();
    setJobs(data.jobs || []); // <-- unwrap jobs array here
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};


  const addJob = async (job: Job) => {
    try {
      const res = await fetch("/api/job/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (!res.ok) throw new Error("Failed to create job");

      const { job: newJob } = await res.json();
      setJobs((prev) => [...prev, newJob]);
      return newJob;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const updateJob = async (job: Job) => {
    if (!job.id) return;
    try {
      const res = await fetch(`/api/job/update/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (!res.ok) throw new Error("Failed to update job");

      const { job: updatedJob } = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
      return updatedJob;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const deleteJob = async (id: number | string) => {
    try {
      const res = await fetch(`/api/job/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return { jobs, setJobs, fetchJobs, addJob, updateJob, deleteJob };
};

export default useJobs;
