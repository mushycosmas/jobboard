// src/pages/ProfilePage.js
import React from 'react';
import UserProfile from '../components/UserProfile';

const dummyUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  location: 'San Francisco'
};

const ProfilePage = () => (
  <div>
    <h1>Your Profile</h1>
    <UserProfile user={dummyUser} />
  </div>
);

export default ProfilePage;
