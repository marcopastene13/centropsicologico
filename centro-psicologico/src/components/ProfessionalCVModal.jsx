import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './ProfessionalCVModal.css';

const ProfessionalCVModal = ({ show, onHide, professional }) => {
  if (!professional || !professional.cv) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" className="cv-modal">
      <Modal.Header closeButton className="cv-modal-header">
        <div className="cv-header-content">
          <img 
            src={professional.image} 
            alt={professional.name}
            className="cv-modal-image"
          />
          <div className="cv-header-info">
            <Modal.Title className="cv-title">{professional.name}</Modal.Title>
            <p className="cv-specialty">{professional.title}</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="cv-modal-body">
        {professional.cv.education && professional.cv.education.length > 0 && (
          <section className="cv-section">
            <h5 className="cv-section-title">
              <i className="bi bi-book"></i> Educación
            </h5>
            <div className="cv-items">
              {professional.cv.education.map((edu) => (
                <div key={edu.id} className="cv-item">
                  <div className="cv-item-header">
                    <h6 className="cv-item-title">{edu.degree}</h6>
                    <span className="cv-item-year">{edu.year}</span>
                  </div>
                  <p className="cv-item-institution">{edu.institution}</p>
                  <p className="cv-item-description">{edu.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {professional.cv.certifications && professional.cv.certifications.length > 0 && (
          <section className="cv-section">
            <h5 className="cv-section-title">
              <i className="bi bi-award"></i> Certificaciones
            </h5>
            <div className="cv-items">
              {professional.cv.certifications.map((cert) => (
                <div key={cert.id} className="cv-item">
                  <div className="cv-item-header">
                    <h6 className="cv-item-title">{cert.title}</h6>
                    <span className="cv-item-year">{cert.year}</span>
                  </div>
                  <p className="cv-item-institution">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {professional.cv.courses && professional.cv.courses.length > 0 && (
          <section className="cv-section">
            <h5 className="cv-section-title">
              <i className="bi bi-mortarboard"></i> Cursos
            </h5>
            <div className="cv-items">
              {professional.cv.courses.map((course) => (
                <div key={course.id} className="cv-item">
                  <div className="cv-item-header">
                    <h6 className="cv-item-title">{course.title}</h6>
                    <span className="cv-item-year">{course.year}</span>
                  </div>
                  <p className="cv-item-institution">{course.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {professional.cv.specializations && professional.cv.specializations.length > 0 && (
          <section className="cv-section">
            <h5 className="cv-section-title">
              <i className="bi bi-lightning"></i> Especializaciones
            </h5>
            <div className="cv-specializations">
              {professional.cv.specializations.map((spec, idx) => (
                <span key={idx} className="cv-badge">{spec}</span>
              ))}
            </div>
          </section>
        )}
      </Modal.Body>

      <Modal.Footer className="cv-modal-footer">
        <Button variant="secondary" onClick={onHide} style={{background: '#6366f1', border: 'none'}}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfessionalCVModal;