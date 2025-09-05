import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import AdminLayout from "../../../layouts/AdminLayout";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; // If no user ID, do not fetch

      try {
        const response = await fetch(`http://localhost:4000/api/admin/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser({
          username: data.username,
          email: data.email,
          phone: data.phone,
        });
      } catch (error) {
        console.error(error);
        alert('Error fetching user data');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:4000/api/admin/user/${userId}`; // Use the appropriate user ID

    try {
      let response;

      if (userId) {
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            email: user.email,
            phone: user.phone,
            userId: userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert('User updated successfully');
        console.log("User updated successfully");
      } else {
        // Handle creating a new user (if applicable)
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user profile');
    }
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Body>
          <Card.Title>Edit User Profile</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4 mb-3 py-2 px-4">
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default UserProfile;
