// src/components/ApplicationForm.js
'use client'
import React, { useState } from 'react';

const ApplicationForm = () => {
  const [form, setForm] = useState({ name: '', email: '', resume: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
      />
      <textarea
        name="resume"
        value={form.resume}
        onChange={handleChange}
        placeholder="Paste your resume here"
        required
      ></textarea>
      <button type="submit">Submit Application</button>
    </form>
  );
};

export default ApplicationForm;
