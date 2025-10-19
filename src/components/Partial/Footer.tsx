'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaRss } from 'react-icons/fa';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null); // 'about' | 'contact' | null

  const handleModalOpen = (contentType) => {
    setModalContent(contentType);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <div className="container-fluid py-3" style={{ backgroundColor: '#276795', color: 'white' }}>
      <div className="container text-start">
        <div className="py-4 row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          <div className="col">
            <img
              src="https://ejobsitesoftware.com/jobboard_demo/img/logo.png"
              width="149"
              height="25"
              alt="Logo"
              className="footer-logo"
            />
            <p className="copyright">
              © 2024{' '}
              <Link href="/" className="text-white" style={{ textDecoration: 'none' }}>
                JOBBOARD DEMO
              </Link>
            </p>

            <ul className="list-unstyled d-flex gap-2">
              <li>
                <a
                  href="https://www.facebook.com/ejobsitesoftware/"
                  className="text-white"
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/ejobsitesoftware/"
                  className="text-white"
                  title="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/ejobsitesoftware/"
                  className="text-white"
                  title="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a
                  href="https://ejobsitesoftware.com/jobboard_demo/industry_rss.php"
                  className="text-white"
                  title="RSS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaRss />
                </a>
              </li>
            </ul>
          </div>

          <div className="col">
            <p><strong>JOB SEEKER</strong></p>
            <ul className="list-unstyled">
              <li>
                <Link href="/register" className="text-white">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/job-search" className="text-white">
                  Search jobs
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div className="col">
            <p><strong>EMPLOYER</strong></p>
            <ul className="list-unstyled">
              <li>
                <Link href="/post-job" className="text-white">
                  Post a job
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-white">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div className="col">
            <p><strong>INFORMATION</strong></p>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen('about');
                  }}
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen('contact');
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent === 'about' ? 'About Us' : 'Contact Us'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent === 'about' ? (
            <div>
              <h5>About Us</h5>
              <p>
                We are a leading job board platform helping job seekers and employers find the best
                match for their needs.
              </p>
            </div>
          ) : (
            <div>
              <h5>Contact Us</h5>
              <p>For inquiries, please email us at support@jobboarddemo.com</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Footer;
