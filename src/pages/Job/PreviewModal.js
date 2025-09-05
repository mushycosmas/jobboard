import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PreviewModal = ({ show, handleClose, job }) => {
    // Destructure the job object and provide default empty arrays for the categories, cultures, and skills
    const {
        title,
        region_id,
        address,
        salary_from,
        salary_to,
        summary,
        description,
        expired_date,
        posting_date,
        category_ids = [],  // Default to empty array if not provided
        category_names = [], // Default to empty array if not provided
        culture_ids = [], // Default to empty array if not provided
        culture_names = [], // Default to empty array if not provided
        skill_ids = [], // Default to empty array if not provided
        skill_names = [] // Default to empty array if not provided
    } = job || {}; // In case job is undefined, default to empty object

    // Format the salary display
    const salaryRange = salary_from && salary_to ? `${salary_from} - ${salary_to}` : 'Negotiable';

    // Format the date display
    const formattedPostingDate = posting_date ? new Date(posting_date).toLocaleDateString() : 'N/A';
    const formattedExpiryDate = expired_date ? new Date(expired_date).toLocaleDateString() : 'N/A';

    // Create a comma-separated list for categories, cultures, and skills
    const categoryDisplay = category_names.join(', ') || 'Not available';
    const cultureDisplay = culture_names.join(', ') || 'Not available';
    const skillDisplay = skill_names.join(', ') || 'Not available';

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Job Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row align-items-center mb-4">
                    <div className="col-md-4 mb-2">
                        <a href="#" title="View company profile">
                            <img 
                                src="https://via.placeholder.com/150" 
                                alt="Company Logo" 
                                className="img-fluid rounded-circle border border-primary" 
                                style={{ width: '150px', height: '150px' }}
                            />
                        </a>
                    </div>
                    <div className="col-md-8">
                        <h1 className="text-dark">{title || 'Job Title Placeholder'}</h1>
                        <div className="mt-2 mb-3 text-muted">
                            <span>
                                <a className="text-primary" href="#" title="View company profile">Company Name Placeholder</a>
                                <span className="mx-2">•</span>
                                <span>{address || 'Location Placeholder'}</span>
                            </span>
                        </div>
                        <div className="row mb-3">
                            <div className="col-auto me-4">
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-briefcase me-2"></i>
                                    <span>{`Experience Level: ${region_id || 'Experience Level Placeholder'}`}</span>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-cash me-2"></i>
                                    <span>{`Salary: ${salaryRange}`}</span>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-calendar2-check me-2"></i>
                                    <span>{`Posted: ${formattedPostingDate}`}</span>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-calendar-x me-2"></i>
                                    <span>{`Expires: ${formattedExpiryDate}`}</span>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-eye me-2"></i>
                                    <span>Views: Number of Views Placeholder</span>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-book me-2"></i>
                                    <span>Education Level Placeholder</span>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-list-check me-2"></i>
                                    <span>{`Category: ${categoryDisplay}`}</span>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <i className="bi bi-gear me-2"></i>
                                    <span>Job Type Placeholder</span>
                                </div>
                            </div>
                        </div>
                        <div className="my-4">
                            <Button variant="primary" className="me-2" style={{ width: '200px' }}>Login to apply</Button>
                            <Button variant="outline-secondary" style={{ width: '200px' }}>Register and apply</Button>
                        </div>
                    </div>
                </div>

                <hr />
                <h3 className="pt-2 pb-2" style={{ fontSize: '1.2rem' }}>Job Summary</h3>
                <div className="card-text" dangerouslySetInnerHTML={{ __html: summary || 'Summary Placeholder' }} />
                <h3 className="pt-3 pb-2" style={{ fontSize: '1.2rem' }}>Job Description</h3>
                <div className="card-text" dangerouslySetInnerHTML={{ __html: description || 'Description Placeholder' }} />
                <h3 className="pt-3 pb-2" style={{ fontSize: '1.2rem' }}>Keyskills</h3>
                <div className="skill-tag">
                    {skill_names && skill_names.length > 0 ? (
                        skill_names.map(skill => <span key={skill} className="badge bg-secondary me-1">{skill}</span>)
                    ) : (
                        <span className="badge bg-secondary me-1">No skills listed</span>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PreviewModal;
