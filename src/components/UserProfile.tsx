// src/components/UserProfile.js
import React from 'react';

const UserProfile = ({ user }) => (
  <div className="user-profile">
    <h1>{user.name}</h1>
    <p>Email: {user.email}</p>
    <p>Location: {user.location}</p>
  </div>
);

export default UserProfile;
