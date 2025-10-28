import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useState } from "react";
import emailjs from '@emailjs/browser';


const contactInfo = [
  {
    title: "Teléfono",
    value: "+56 9 1234 5678",
    icon: "📞",
    link: "tel:+56912345678"
  },
  {
    title: "Email",
    value: "cconsultapsicologica@gmail.com",
    icon: "📧",
    link: "mailto:cconsultapsicologica@gmail.com"
  },
  {
    title: "Dirección",
    value: "Gral. Ordóñez 155, of. 1104",
    icon: "📍",
    link: "https://maps.app.goo.gl/xqfQvmWpq45gDET8A"
  },
  {
    title: "Horarios",
    value: "Lun-Vie: 9:00-21:00",
    icon: "🕒",
    link: null
  }
];

function sendEmail(e) {
  e.preventDefault();

  emailjs.sendForm(
    "TU_SERVICE_ID",    // Reemplaza con tu Service ID
    "TU_TEMPLATE_ID",   // Reemplaza con tu Template ID
    e.target,
    "TU_USER_ID"        // Reemplaza con tu User ID
  )
  .then(() => {
    alert("¡Mensaje enviado con éxito! Nos contactaremos contigo pronto.");
    e.target.reset();
  })
  .catch(() => {
    alert("Error al enviar el mensaje. Intenta nuevamente.");
  });
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log('Datos del formulario:', formData);
    alert('Mensaje enviado. Te contactaremos pronto.');
    // Resetear formulario
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Contacto</h1>
        <p className="lead">
          Estamos aquí para ayudarte. No dudes en contactarnos.
        </p>
      </div>

      <Row>
        {/* Información de contacto */}
        <Col md={4} className="mb-4">
          
          {contactInfo.map((info, index) => (
            <Card key={index} className="custom-card mb-3">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <span style={{ fontSize: "1.5rem", marginRight: "15px" }}>
                    {info.icon}
                  </span>
                  <div>
                    <h6 className="mb-1">{info.title}</h6>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        className="text-decoration-none"
                        target={info.link.startsWith('http') ? '_blank' : '_self'}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span>{info.value}</span>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* Enlaces rápidos de WhatsApp */}
          <Card className="custom-card">
            <Card.Body>
              <Card.Title className="mb-3">WhatsApp Directo</Card.Title>
              <div className="d-grid gap-2">
                <Button 
                  href="https://wa.me/56912345678?text=Hola,%20quiero%20información%20sobre%20los%20servicios"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="success"
                  size="sm"
                >
                  Contacto General
                </Button>
                <Button 
                  href="https://wa.me/56912345678?text=Hola,%20quiero%20agendar%20una%20cita"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-success"
                  size="sm"
                >
                  Agendar Cita
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Formulario de contacto */}
        <Col md={8}>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title className="mb-4">Envíanos un Mensaje</Card.Title>
              
              <Form onSubmit={sendEmail}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+56 9 1234 5678"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Mensaje *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Enviar Mensaje
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  * Campos obligatorios. Te responderemos dentro de 24 horas.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
