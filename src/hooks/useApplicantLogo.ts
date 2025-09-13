'use client';

import { useState, useEffect, ChangeEvent } from 'react';

interface UseApplicantLogoReturn {
  logo: string;
  newLogo: File | null;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fetchLogo: () => Promise<void>;
  uploadLogo: () => Promise<void>;
}

export const useApplicantLogo = (applicantId: string | null): UseApplicantLogoReturn => {
  const [logo, setLogo] = useState<string>('https://via.placeholder.com/100');
  const [newLogo, setNewLogo] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewLogo(file);
  };

  // Fetch logo from API
  const fetchLogo = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`/api/applicant/logo/${applicantId}`);
      if (!res.ok) throw new Error('Failed to fetch logo');
      const data = await res.json();
      const logoPath = data.logo || 'https://via.placeholder.com/100';
      setLogo(logoPath);

      if (typeof window !== 'undefined') {
        localStorage.setItem('logo', logoPath);
      }
    } catch (err) {
      console.error('Error fetching logo:', err);
      setLogo('https://via.placeholder.com/100');
    }
  };

  // Upload new logo
  const uploadLogo = async () => {
    if (!newLogo || !applicantId) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('logo', newLogo);

    try {
      const res = await fetch(`/api/applicant/upload-logo/${applicantId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload logo');

      const data = await res.json();
      if (data.success && data.logoPath) {
        setLogo(data.logoPath);
        if (typeof window !== 'undefined') {
          localStorage.setItem('logo', data.logoPath);
        }
      } else {
        alert('Failed to upload logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
    }
  };

  // Load logo from localStorage or fetch on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedLogo = localStorage.getItem('logo');
    if (storedLogo) {
      setLogo(storedLogo);
    } else {
      fetchLogo();
    }
  }, [applicantId]);

  return { logo, newLogo, handleFileChange, fetchLogo, uploadLogo };
};
