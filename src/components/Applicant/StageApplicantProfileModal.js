import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getRecruitmentstage, moveApplicantToStage } from '../../api/api';
import InterviewDetailsForm from '../InterviewStage/InterviewDetails';
import AssessmentDetailsForm from '../InterviewStage/AssessmentDetailsForm';
import ScreeningDetailsForm from '../InterviewStage/ScreeningDetailsForm';

const StageApplicantProfileModal = ({
  applicationId,
  applicantData,
  experiencesData = [],
  skills = [],
  socialMediaLinks = [],
  setShowProfileModal,
  employerId,
  educationalQualifications = [],
  professionalQualifications = [],
}) => {
  const [selectedStageId, setSelectedStageId] = useState('');
  const [stages, setStages] = useState([]);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showScreeningModal, setShowScreeningModal] = useState(false);

  const [interviewDetails, setInterviewDetails] = useState({
    date: '', time: '', venue: '', duration: '', notes: '', interviewer_id: null,
  });

  const [assessmentDetails, setAssessmentDetails] = useState({
    type: 'assessment', result: 'Pending', date_taken: '', duration: '', notes: '',interviewer_id: null,
  });
  const [screeningDetails, setScreeningDetails] = useState({ notes: '' });

  // Fetch stages on employerId change
  useEffect(() => {
    if (!employerId) return;

    const fetchStages = async () => {
      try {
        const response = await getRecruitmentstage(employerId);
        setStages(response?.stages || []);
      } catch (err) {
        console.error('Failed to fetch stages:', err);
      }
    };

    fetchStages();
  }, [employerId]);

  const handleStageSelect = (e) => {
    const stageId = e.target.value;
    setSelectedStageId(stageId);

    const stageName = stages.find(s => s.id.toString() === stageId)?.name?.toLowerCase() || '';
    setShowInterviewModal(stageName.includes('interview'));
    setShowAssessmentModal(stageName.includes('assessment'));
    setShowScreeningModal(stageName.includes('screening'));
  };

  const handleStageShift = async () => {
    if (selectedStageId === applicantData?.stage_id?.toString()) {
      return alert('Applicant is already in this stage.');
    }

    const selectedStage = stages.find(stage => stage.id.toString() === selectedStageId);
    const stageName = selectedStage?.name?.toLowerCase() || '';
    let payload = {};

    try {
      if (stageName.includes('interview')) {
        const { date, time, venue, duration } = interviewDetails;
        if (!date || !time || !venue || !duration) {
          return alert('Please fill in all interview details.');
        }

        payload = {
          type: 'interview',
          result: 'Pending',
          interviewer_id: interviewDetails.interviewer_id || null,
          interview_time: `${date} ${time}`,
          location: venue,
          duration,
          notes: interviewDetails.notes || '',
        };

      } else if (stageName.includes('assessment')) {
        const { date_taken, duration } = assessmentDetails;
     

        payload = {
          type: 'assessment',
          result: 'Pending',
          date_taken:`${date_taken}`,
          evaluator_id: assessmentDetails.evaluator_id || null,
          duration,
          notes: assessmentDetails.notes || '',
        };

      } else if (stageName.includes('screening')) {
        payload = {
          type: 'screening',
          result: 'Pending',
          method:screeningDetails.method || '',
          screener_id:screeningDetails.screener_id || null,
          notes: screeningDetails.notes || '',
          outcome:screeningDetails.outcome || '',
        };
      }

      await moveApplicantToStage(applicationId, selectedStageId, payload);
      alert('Applicant moved successfully.');

      // Reset modals
      setShowInterviewModal(false);
      setShowAssessmentModal(false);
      setShowScreeningModal(false);
    } catch (err) {
      console.error('Error moving applicant:', err);
      alert('Failed to move applicant.');
    }
  };

  return (
    <>
      <Modal show onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{applicantData?.first_name} {applicantData?.last_name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className={styles.cvContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className="profile">
                <img
                  src={applicantData?.logo ? `http://localhost:4000${applicantData.logo}` : 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className={styles.profileImg}
                />
                <h2 className={styles.profileName}>
                  {applicantData?.first_name} {applicantData?.last_name}
                </h2>
                <p className={styles.profileTitle}>Senior Software Engineer</p>
                <div className={styles.profileContact}>
                  <p>Email: {applicantData?.email}</p>
                  <p>Phone: {applicantData?.phone_number}</p>
                </div>
              </div>

              <div className={styles.links}>
                {socialMediaLinks.length ? (
                  socialMediaLinks.map(link => (
                    <p key={link.id}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.social_media_name}
                      </a>
                    </p>
                  ))
                ) : <p>No social links</p>}
              </div>
            </aside>

            {/* Main Content */}
            <section className={styles.mainContent}>
              <div className={styles.section}>
                <h3>About Me</h3>
                <p>{applicantData?.about || 'No about section provided.'}</p>
              </div>

              <div className={styles.section}>
                <h3>Work Experience</h3>
                {experiencesData.length ? (
                  <ul>
                    {experiencesData.map(exp => (
                      <li key={exp.id}>
                        <h4>{exp.position} | {exp.institution}</h4>
                        <p>
                          <strong>
                            {new Date(exp.from).toLocaleDateString()} - {exp.to === 'Present' ? 'Present' : new Date(exp.to).toLocaleDateString()}
                          </strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : <p>No experience provided</p>}
              </div>

              <div className={styles.section}>
                <h3>Education</h3>
                {educationalQualifications.length ? (
                  <ul>
                    {educationalQualifications.map(edu => (
                      <li key={edu.id}>
                        <h4>{edu.education_level} {edu.programme}</h4>
                        <p><strong>{edu.institution}</strong> | Graduated: {new Date(edu.ended).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p>No education info</p>}
              </div>

              <div className={styles.section}>
                <h3>Skills</h3>
                {skills.length ? (
                  <div className={styles.skills}>
                    {skills.map(skill => (
                      <span key={skill.id} className={styles.skill}>{skill.skill_name}</span>
                    ))}
                  </div>
                ) : <p>No skills provided</p>}
              </div>

              <div className={styles.section}>
                <h3>Recruitment Stage</h3>
                <p>
                  Current Stage: <strong>{stages.find(s => s.id === applicantData?.stage_id)?.name || 'Unknown'}</strong>
                </p>
                <Form.Group>
                  <Form.Label>Move to another stage</Form.Label>
                  <Form.Select value={selectedStageId} onChange={handleStageSelect}>
                    <option value="">Select stage</option>
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id} disabled={stage.id === applicantData?.stage_id}>
                        {stage.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={handleStageShift}
                  disabled={!selectedStageId}
                >
                  Move Applicant
                </Button>
              </div>
            </section>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Conditionally Rendered Modals */}
      <InterviewDetailsForm
        show={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSubmit={handleStageShift}
        interviewDetails={interviewDetails}
        setInterviewDetails={setInterviewDetails}
      />

      <AssessmentDetailsForm
        show={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onSubmit={handleStageShift}
        assessmentDetails={assessmentDetails}
        setAssessmentDetails={setAssessmentDetails}
      />

<ScreeningDetailsForm
  show={showScreeningModal}
  onClose={() => setShowScreeningModal(false)}
  onSubmit={handleStageShift}
  screeningDetails={screeningDetails}
  setScreeningDetails={setScreeningDetails}
/>

    </>
  );
};

export default StageApplicantProfileModal;
