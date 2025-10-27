import React from "react";
import { Button, Table } from "react-bootstrap";
import { Category } from "./CategoryService";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const CategoryTable: React.FC<Props> = ({ categories, onEdit, onDelete }) => {
  return (
    <Table bordered hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th style={{ width: "10%" }}>#</th>
          <th style={{ width: "70%" }}>Category Name</th>
          <th style={{ width: "20%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <tr key={category.id || index}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => category.id && onDelete(category.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-muted">
              No categories found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
