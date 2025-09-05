import React from 'react';

const Profile = ({ profile, socialMediaLinks }) => (
  <div className="profile">
    <img
      src={profile?.profileImage || 'https://via.placeholder.com/100'}
      alt="Profile"
      className="profile-img"
    />
    <h2 className="profile-name">{profile?.name}</h2>
    <p className="profile-title">{profile?.title || 'Senior Software Engineer'}</p>
    <div className="profile-contact">
      <p>Email: {profile?.email}</p>
      <p>Phone: {profile?.phone}</p>
    </div>
    <div className="links">
      {socialMediaLinks.length > 0 ? (
        socialMediaLinks.map(link => (
          <p key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.url}
            </a>
          </p>
        ))
      ) : (
        <p>No social media links available</p>
      )}
    </div>
  </div>
);

export default Profile;
