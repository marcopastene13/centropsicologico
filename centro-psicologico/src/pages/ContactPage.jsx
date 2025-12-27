import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const contactInfo = [
  {
    title: "Teléfono",
    value: "+56 9 3273 6893",
    icon: "📞",
    link: "tel:+56932736893",
  },
  {
    title: "Email",
    value: "cconsultapsicologica@gmail.com",
    icon: "📧",
    link: "mailto:cconsultapsicologica@gmail.com",
  },
  {
    title: "Dirección",
    value: "Gral. Ordóñez 155, of. 1104, Maipú, Santiago.",
    icon: "📍",
    link: "https://maps.app.goo.gl/xqfQvmWpq45gDET8A",
  },
  {
    title: "Horarios",
    value: "Lun-Vie: 9:00-21:00",
    icon: "🕒",
    link: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .send(
        "service_ol2qqqb",
        "template_grfup76",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        "t2XPGSWW8YS9MUwlv"
      )
      .then(() => {
        alert("¡Mensaje enviado con éxito! Nos contactaremos contigo pronto.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      })
      .catch(() => {
        alert("Error al enviar el mensaje. Intenta nuevamente.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <Container className="mt-4 mb-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 mb-3">Contacto y agendamiento</h1>
        <p className="lead">
          Cuéntanos brevemente tu motivo de consulta y te responderemos dentro
          de las próximas 24 horas hábiles.
        </p>
      </div>

      <Row className="contact-row">
        {/* Información de contacto */}
        <Col md={4} className="mb-4 contact-col-left">
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
                        target={
                          info.link.startsWith("http") ? "_blank" : "_self"
                        }
                        rel={
                          info.link.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
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
          <Card className="custom-card contact-whatsapp-card">
            <Card.Body>
              <Card.Title className="mb-3">WhatsApp directo</Card.Title>
              <p className="small text-muted mb-3">
                Si prefieres, también puedes escribirnos directamente por
                WhatsApp.
              </p>
              <div className="d-grid gap-2">
                <Button
                  href="https://wa.me/56912345678?text=Hola,%20quiero%20información%20sobre%20los%20servicios"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="success"
                  size="sm"
                >
                  Contacto general
                </Button>
                <Button
                  href="https://wa.me/56912345678?text=Hola,%20quiero%20agendar%20una%20cita"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-success"
                  size="sm"
                >
                  Agendar cita
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Formulario de contacto */}
        <Col md={8} className="mb-4 contact-col-right">
          <Card className="custom-card h-100 d-flex flex-column">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-4">Envíanos un Mensaje</Card.Title>

            <div className="flex-grow-1">
              <Form id="contact-form" onSubmit={handleSendEmail}>
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
                    placeholder="Cuéntanos en qué podemos ayudarte (por ejemplo: ansiedad, duelo, dificultades de pareja, etc.)."
                    required
                  />
                </Form.Group>
                
              </Form>
            </div>

            <div className="d-grid">
                  <Button
                    variant="success"
                    type="submit"
                    size="lg"
                    disabled={isSending}
                  >
                    {isSending ? "Enviando..." : "Enviar mensaje"}
                  </Button>
                </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  * Campos obligatorios. Si necesitas una respuesta urgente,
                  también puedes llamarnos o escribir por WhatsApp.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
