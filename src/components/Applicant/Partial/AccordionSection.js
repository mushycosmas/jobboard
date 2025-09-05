const AccordionSection = ({ activeKey, handleAccordionSelect }) => {
  return (
    <Accordion activeKey={activeKey} onSelect={handleAccordionSelect}>
      <Accordion.Item eventKey="0" className="mt-2">
        <Accordion.Header>
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Accordion.Header>
        <Accordion.Body>
          <Link to="/applicant/dashboard" className="accordion-button2 fw-bold drop-padd card-dashboard2">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className="bi bi-person-bounding-box me-2" style={{ color: '#808080' }}></i> My Profile
        </Accordion.Header>
        <Accordion.Body>
          <div className="pb-1"><Link to="/applicant/personal-details">Personal Details</Link></div>
          <div className="pb-1"><Link to="/applicant/academic">Academic Qualifications</Link></div>
          <div className="pb-1"><Link to="/applicant/professional">Professional Qualifications</Link></div>
          <div className="pb-1"><Link to="/applicant/language">Language Proficiency</Link></div>
          <div className="pb-1"><Link to="/applicant/working-experience">Work Experience</Link></div>
          <div className="pb-1"><Link to="/applicant/skills">Skills</Link></div>
          <div className="pb-1"><Link to="/applicant/referees">Referees</Link></div>
          <div className="pb-1"><Link to="/applicant/social-media">Social Media</Link></div>
          <div className="pb-1"><Link to="/applicant/change-password">Change Password</Link></div>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
        <Accordion.Header>
          <i className="bi bi-file-earmark-text me-2" style={{ color: '#808080' }}></i> Build My CV
        </Accordion.Header>
        <Accordion.Body>
          <div className="pb-1"><Link to="/applicant/build-cv">Select Cv Template</Link></div>
          <div className="pb-1"><Link to="/applicant/view-cv">My CV</Link></div>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="3">
        <Accordion.Header>
          <i className="bi bi-briefcase-fill me-2" style={{ color: '#808080' }}></i> My Applications
        </Accordion.Header>
        <Accordion.Body>
          <div className="pb-1"><Link to="/applicant/applied-jobs">Applied Jobs </Link></div>
          <div className="pb-1"><Link to="/applicant/saved-jobs">Saved Jobs</Link></div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default AccordionSection;
