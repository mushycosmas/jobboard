import React from 'react';
import { Container } from 'react-bootstrap';
import PasswordChangeForm from '../../../components/Auth/PasswordChangeForm';
import ApplicantLayout from "../../../Layouts/ApplicantLayout";

const ApplicantChangePassword = () => {
  
  const handlePasswordChange = async (currentPassword, newPassword) => {
    console.log('Token:', localStorage.getItem('token')); // Log the token for debugging
    try {
      const response = await fetch('http://localhost:4000/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      alert('Password changed successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <ApplicantLayout>
      <Container>
        <PasswordChangeForm onSubmit={handlePasswordChange} />
      </Container>
    </ApplicantLayout>
  );
};

export default ApplicantChangePassword;
