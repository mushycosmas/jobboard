// src/utils/jobActions.ts
export const checkAlreadyApplied = async (applicantId: string, jobId: number) => {
  try {
    const res = await fetch(`/api/applicant/job/applications/${applicantId}`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    const applications = await res.json();
    return applications.some((app: any) => app.job_id === jobId);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const submitApplication = async (
  applicantId: string,
  jobId: number,
  letter: string
) => {
  const res = await fetch(`/api/applicant/job/applications/${applicantId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId, letter, status: 'Pending' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit application');
  return data;
};

export const checkAlreadySaved = async (applicantId: string, jobId: number) => {
  try {
    const res = await fetch(`/api/applicant/job/saved-jobs/${applicantId}`);
    if (!res.ok) throw new Error('Failed to fetch saved jobs');
    const savedJobs = await res.json();
    return savedJobs.some((sj: any) => sj.job_id === jobId);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const saveJob = async (applicantId: string, jobId: number) => {
  const res = await fetch(`/api/applicant/job/saved-jobs/${applicantId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save job');
  return data;
};
