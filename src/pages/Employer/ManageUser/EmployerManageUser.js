import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import EmployerLayout from '../../../Layouts/EmployerLayout';

const EmployerManageUser = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    id: null,
    username: '',
    email: '',
    password: 'default',
    userType: 'employer',  // Default user type (you can change this based on your logic)
  });

  // Get the employer_id from localStorage
  const employerId = localStorage.getItem('employerId');
  console.log('Employer ID:', employerId);  // For debugging purposes

  // Fetch users associated with the employer
  const fetchUsers = async () => {
    try {
      if (!employerId) {
        throw new Error('Employer ID not found');
      }

      const response = await fetch(`http://localhost:4000/api/employers/users/${employerId}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Run the fetch function when the component mounts or when employerId changes
  useEffect(() => {
    fetchUsers();
  }, [employerId]);

  // Open modal to add new user
  const handleShow = () => {
    setNewUser({id: null, username: '', email: '', password: 'default', userType: 'employer' });
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => setShowModal(false);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Add or Edit user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...newUser, employer_id: employerId };  // Add employer_id to newUser

      const method = updatedUser.id ? 'PUT' : 'POST';
      const url = updatedUser.id
        ? `http://localhost:4000/api/employers/user/${updatedUser.id}`
        : `http://localhost:4000/api/employers/user/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error(`Failed to ${updatedUser.id ? 'update' : 'create'} user`);

      const userResponse = await response.json();
      if (updatedUser.id) {
        // Update the existing user in the state
        setUsers(users.map((user) => (user.id === updatedUser.id ? userResponse : user)));
      } else {
        // Add the new user to the state
        setUsers((prevUsers) => [...prevUsers, userResponse]);
      }

      handleClose();
      fetchUsers();  // Re-fetch users to get the latest data
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/employers/user/delete/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user');
        
        // After deleting, fetch the users again to refresh the list
        fetchUsers();  // Re-fetch users to get the latest data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Populate the modal with user data for editing
  const handleEdit = (user) => {
    
    setNewUser(user);  // Populate the form with user data
    setShowModal(true);
  };

  return (
    <EmployerLayout>
      <div className="content">
        <h2>Manage Users</h2>
        <Button variant="primary" onClick={handleShow}>
          Add New User
        </Button>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    style={{
                      color: user.hide === 0 ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {user.hide === 0 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for adding or editing a user */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{newUser.id ? 'Edit User' : 'Add New User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUserName">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleChange}
                  placeholder="Enter user's username"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formUserEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  placeholder="Enter user's email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formUserPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  placeholder="Enter user's password"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                {newUser.id ? 'Update User' : 'Add User'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </EmployerLayout>
  );
};

export default EmployerManageUser;
