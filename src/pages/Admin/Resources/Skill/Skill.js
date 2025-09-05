import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';

// API Endpoint
const API_URL = 'http://localhost:4000/api/admin/resource/skill';

const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchSkills = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch skills');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleShowModal = (skill = null) => {
    setCurrentSkill(skill);
    setIsEditing(!!skill);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentSkill(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${currentSkill.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentSkill),
      });

      if (!response.ok) throw new Error('Failed to save skill');
      fetchSkills();
      const updatedSkill = await response.json();
      setSkills((prev) => {
        if (isEditing) {
          return prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s));
        } else {
          return [...prev, updatedSkill];
        }
      });

      handleCloseModal();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete skill');

        setSkills((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="content">
        <h2>Manage Skills</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Button variant="success" onClick={() => handleShowModal()} className="mb-3">
              Add Skill
            </Button>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td>{skill.skill_name}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleShowModal(skill)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(skill.id)} className="ms-2">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Skill' : 'Add Skill'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSkillName">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                value={currentSkill ? currentSkill.skill_name : ''}
                onChange={(e) => setCurrentSkill({ ...currentSkill, skill_name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              {isEditing ? 'Update' : 'Add'} Skill
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default Skill;
