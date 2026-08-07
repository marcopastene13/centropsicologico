// src/components/WhyChooseUs.jsx - Versión Minimalista

import { Container, Row, Col } from 'react-bootstrap';
import '../styles/WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      icon: '🎓',
      title: '15+ años de experiencia',
      description: 'Atendiendo en Maipú desde 2009'
    },
    {
      icon: '🔒',
      title: 'Confidencialidad garantizada',
      description: 'Ambiente seguro y profesional'
    },
    {
      icon: '📱',
      title: 'Presencial y online',
      description: 'Elige la modalidad que prefieras'
    }
  ];

  return (
    <section className="why-choose-us-minimal">
      <Container>
        <div className="text-center mb-4">
          <h2 className="section-title-minimal">¿Por qué elegirnos?</h2>
        </div>

        <Row className="g-3 justify-content-center">
          {features.map((feature, index) => (
            <Col key={index} xs={12} sm={6} md={4}>
              <div className="feature-card-minimal">
                <div className="feature-icon-minimal">{feature.icon}</div>
                <h3 className="feature-title-minimal">{feature.title}</h3>
                <p className="feature-description-minimal">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
