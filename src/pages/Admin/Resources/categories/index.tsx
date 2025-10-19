import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Modal, Button, Form, Table, Card, Spinner } from 'react-bootstrap';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/admin/resource/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const openModal = (category = null) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCategory(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:4000/api/admin/resource/category';

    try {
      let response;
      if (currentCategory?.id) {
        response = await fetch(`${url}/${currentCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            industry_name: currentCategory.industry_name,
            updator_id: '1',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setCategories(categories.map(category => 
          category.id === currentCategory.id ? { ...category, industry_name: currentCategory.industry_name } : category
        ));
        console.log("Category updated successfully");
      } else {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            industry_name: currentCategory.industry_name,
            creator_id: '2',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        console.log("Category added successfully");
      }

      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
  
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/resource/category/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setCategories(categories.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="content">
        <Card>
          <Card.Header>
            <h4 className="mb-4">Manage Categories</h4>
          </Card.Header>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <Button variant="success" onClick={() => openModal()} className="mb-3">Add Category</Button>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.industry_name}</td>
                      <td>
                        <Button variant="warning" onClick={() => openModal(category)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(category.id)} className="ms-2">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          )}
        </Card>
        <Modal show={isModalOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{currentCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCategory ? currentCategory.industry_name : ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, industry_name: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                {currentCategory ? 'Update' : 'Add'} Category
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Category;
