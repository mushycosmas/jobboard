// utils/jobView.ts
export const incrementJobView = async (slug: string) => {
  if (!slug || typeof window === 'undefined') return;

  const key = `job_viewed_${slug}`;

  // Prevent multiple counts per session
  if (sessionStorage.getItem(key)) return;

  sessionStorage.setItem(key, '1');

  try {
    const res = await fetch(`/api/job/${slug}/view`, {
      method: 'POST',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`❌ Failed to increment job view for "${slug}"`);
    }
  } catch (error) {
    console.error('❌ Error incrementing job view:', error);
  }
};
