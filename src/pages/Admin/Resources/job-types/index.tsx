"use client";
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  JobType,
  getJobTypes,
  addJobType,
  updateJobType,
  deleteJobType,
} from "./JobTypeService";
import JobTypeTable from "./JobTypeTable";
import JobTypeModal from "./JobTypeModal";

const JobTypeIndex: React.FC = () => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentJobType, setCurrentJobType] = useState<JobType>({ id: undefined, name: "" });

  const loadJobTypes = async () => {
    setLoading(true);
    try {
      const data = await getJobTypes();
      setJobTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: currentJobType.name?.trim() };
    if (!payload.name) return alert("Job type name is required.");

    try {
      if (currentJobType.id) await updateJobType(currentJobType.id, payload);
      else await addJobType(payload);

      setShowModal(false);
      setCurrentJobType({ id: undefined, name: "" });
      loadJobTypes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (jt: JobType) => {
    setCurrentJobType(jt);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentJobType({ id: undefined, name: "" });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job type?")) return;
    try {
      await deleteJobType(id);
      loadJobTypes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="content p-3">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Manage Job Types</h4>
            <Button variant="success" onClick={handleAddNew}>
              Add Job Type
            </Button>
          </Card.Header>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Card.Body>
              <JobTypeTable jobTypes={jobTypes} onEdit={handleEdit} onDelete={handleDelete} />
            </Card.Body>
          )}
        </Card>

        <JobTypeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          jobType={currentJobType}
          setJobType={setCurrentJobType}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default JobTypeIndex;
