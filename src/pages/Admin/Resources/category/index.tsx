"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Form } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  Category,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./CategoryService"; // ✅ create this service like LocationService
import CategoryTable from "./CategoryTable"; // ✅ similar to RegionTable
import CategoryModal from "./CategoryModal"; // ✅ similar to RegionModal

const CategoryIndex: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>({
    id: undefined,
    name: "",
  });

  // Load all categories
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle add/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: currentCategory.name?.trim(),
    };

    if (!payload.name) {
      alert("Category name is required.");
      return;
    }

    try {
      if (currentCategory.id) {
        await updateCategory(currentCategory.id, payload);
      } else {
        await addCategory(payload);
      }

      setShowModal(false);
      setCurrentCategory({ id: undefined, name: "" });
      loadCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Edit category
  const handleEdit = (category: Category) => {
    setCurrentCategory({
      id: category.id,
      name: category.name || "",
    });
    setShowModal(true);
  };

  // Add new category
  const handleAddNew = () => {
    setCurrentCategory({ id: undefined, name: "" });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Manage Categories</h4>
            <Button variant="success" onClick={handleAddNew}>
              Add Category
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          )}
        </Card>

        <CategoryModal
          show={showModal}
          onHide={() => setShowModal(false)}
          category={currentCategory}
          setCategory={setCurrentCategory}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryIndex;
