const LogoSection = ({ logo, setLogo, showModal, setShowModal, handleFileChange, handleLogoUpload }) => {
    return (
      <>
        <Card style={{ marginBottom: '0.1rem' }}>
          <Card.Body>
            <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={logo ? `http://localhost:4000${logo}` : 'https://via.placeholder.com/100'}
                alt="Logo"
                style={{ width: '100px', borderRadius: '0.5rem' }}
              />
            </div>
            <div className="text-center mt-2">
              <a href="#" className="small" style={{ color: '#0a66c2' }} onClick={() => setShowModal(true)}>
                Edit Logo
              </a>
            </div>
          </Card.Body>
        </Card>
  
        {/* Logo upload modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload New Logo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleLogoUpload}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  export default LogoSection;
  