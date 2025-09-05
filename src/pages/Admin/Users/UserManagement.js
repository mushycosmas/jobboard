import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AdminLayout from '../../../layouts/AdminLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ userId: null, username:"", password:"", email:"", userType:""});
  

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShow = () => {
    setNewUser({ userId: null, username: '', email: '',password:'default', userType: 'Admin' }); // Reset form
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = newUser.id ? 'PUT' : 'POST';
      const url = newUser.id
        ? `http://localhost:4000/api/admin/user/${newUser.id}`
        : 'http://localhost:4000/api/admin/user/';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error(`Failed to ${newUser.id ? 'update' : 'create'} user`);

      const userResponse = await response.json();
      if (newUser.id) {
        setUsers(users.map(user => (user.id === newUser.id ? userResponse : user))); // Update user
      } else {
        setUsers(prevUsers => [...prevUsers, userResponse]); // Add new user
      }
      handleClose();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/user/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user');
        setUsers(users.filter(user => user.id !== id)); // Remove deleted user from the state
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setNewUser(user); // Populate the form with the user's data
    setShowModal(true);
  };

  return (
    <AdminLayout>
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
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
  <span 
    style={{
      color: user.hide === 0 ? 'green' : 'red',
      fontWeight: 'bold'
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
                  value={newUser.username}  // Corrected to use username instead of name
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
              <Form.Group controlId="formUserStatus">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value="default"
                  placeholder="Enter user's password"
                  disabled
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {newUser.id ? 'Update User' : 'Add User'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
