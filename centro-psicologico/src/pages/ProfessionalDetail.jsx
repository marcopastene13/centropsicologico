import { Container, Button, Row, Col, Card, Badge, Form, Image, Nav } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import '../styles/ProfessionalDetail.css';
import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from 'react';

import ProfessionalCVModal from "../components/ProfessionalCVModal";



const ProfessionalDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(null);


  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
    const [showCVModal, setShowCVModal] = useState(false);


  const serviceDetails = {
    1: {
      id: 1,
      name: 'Patricia Santander',
      title: 'Psicóloga Clínica',
      image: "/images/professionals/patty.jpg",
      bio: 'Especialista en terapia cognitivo-conductual con 10 años de experiencia.',
      services: [
        { id: 1, name: 'Terapia Individual', price: 80000, duration: 60 },
        { id: 2, name: 'Terapia de Pareja', price: 100000, duration: 60 },
        { id: 3, name: 'Consulta Inicial', price: 50000, duration: 45 }
      ],
      availability: ['Lunes', 'Miércoles', 'Viernes'],
      rating: 4.8,
      reviews: 45
    },
    2: {
      id: 2,
      name: 'Yasna Valdes',
      title: 'Psicólogo Especialista en Ansiedad',
      image: "/images/professionals/yasna.jpg",
      bio: 'Experto en tratamiento de trastornos de ansiedad y estrés postraumático.',
      services: [
        { id: 1, name: 'Terapia Individual', price: 85000, duration: 60 },
        { id: 2, name: 'Técnicas de Relajación', price: 60000, duration: 45 }
      ],
      availability: ['Martes', 'Jueves'],
      rating: 4.9,
      reviews: 52
    }
  };

  const professional = serviceDetails[id] || serviceDetails[1];
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail) {
      alert('Por favor completa todos los campos');
      return;
    }

    setBookingDetails({
      professional,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      client: {
        name: clientName,
        email: clientEmail,
        phone: clientPhone
      }
    });


    // Enviar notificaciones por WhatsApp
    const doctorPhone = professional.phone || '56912345678'; // Número de la doctora

    
    const message = `*Nueva Reserva de Hora*%0A%0A*Profesional:* ${professional.name}%0A*Servicio:* ${selectedService}%0A*Fecha:* ${selectedDate.toLocaleDateString('es-CL')}%0A*Hora:* ${selectedTime}%0A%0A*Datos del Paciente:*%0ANombre: ${clientName}%0AEmail: ${clientEmail}%0ATeléfono: ${clientPhone}`;
    
    // Abrir WhatsApp para enviar a la doctora
    window.open(`https://wa.me/${doctorPhone}?text=${message}`, '_blank');
    
    // Abrir WhatsApp para enviar al paciente
    setTimeout(() => {
      window.open(`https://wa.me/${clientPhone}?text=${message}`, '_blank');
    }, 1000);
    
    alert('¡Reserva confirmada! Se enviarán las notificaciones por WhatsApp.');
    
    // Resetear formulario
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };




  return (
    <>
      <div className="professional-header" >
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="text-center mb-4 mb-md-0">
              <Image
                src={professional.image}
                alt={professional.name}
                roundedCircle
                width={300}
                height={300}
                className="border-5 border-white"
              />
            </Col>
            <Col md={8}>
              <h1 className="mb-2" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{professional.name}</h1>
              <h4 className="mb-3" style={{ fontSize: '1.3rem', opacity: 0.9 }}>{professional.title}</h4>
              <p className="mb-4" style={{ fontSize: '1.1rem' }}>{professional.bio}</p>
              <div className="d-flex gap-3">
                <Badge bg="light" text="dark" className="p-2 fs-6">
                  ⭐ {professional.rating} ({professional.reviews} reseñas)
                </Badge>
                <Badge bg="success" className="p-2 fs-6">
                  ✓ Verificado
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <button
          onClick={() => setShowCVModal(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #5558d3 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>📄</span>
          Ver CV Completo
        </button>
        <Nav variant="tabs" className="mb-5 border-bottom-2" activeKey={activeTab}>
          <Nav.Item>
            <Nav.Link
              eventKey="services"
              onClick={() => setActiveTab('services')}
              className="fs-5 fw-bold"
              style={{ color: activeTab === 'services' ? '#667eea' : '#666' }}
            >
              📋 Servicios
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="booking"
              onClick={() => setActiveTab('booking')}
              className="fs-5 fw-bold"
              style={{ color: activeTab === 'booking' ? '#667eea' : '#666' }}
            >
              📅 Agendar Cita
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'services' && (
          <Row className="g-4">
            {professional.services.map((service) => (
              <Col key={service.id} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 hover-shadow" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => {
                    setSelectedService(service);
                    setActiveTab('booking');
                  }}
                >
                  <Card.Body>
                    <Card.Title className="fs-5 fw-bold text-primary mb-3">{service.name}</Card.Title>
                    <div className="mb-3">
                      <p className="mb-2"><strong>Precio:</strong> <span style={{ fontSize: '1.5rem', color: '#667eea' }}>\${service.price.toLocaleString()}</span></p>
                      <p className="mb-0"><strong>Duración:</strong> {service.duration} minutos</p>
                    </div>
                    <Button variant="primary" className="w-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                      Agendar →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {activeTab === 'booking' && (
          <Row className="booking-panel-row">
            <Col lg={4} xs={4} md={4}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                  <h5 className="mb-4 fw-bold text-primary">📅 Selecciona una fecha</h5>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    className="w-100"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} xs={4} md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <h5 className="mb-4 fw-bold text-primary">🕐 Selecciona una hora</h5>
                  <div className="d-grid gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'primary' : 'outline-primary'}
                        onClick={() => setSelectedTime(time)}
                        className="fw-bold"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} xs={4} md={4}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                  <h5 className="mb-4 fw-bold text-primary">👤 Tus datos</h5>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Tu nombre"
                        className="border-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="border-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Teléfono (opcional)</Form.Label>
                      <Form.Control
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Si el usuario borra todo, vuelve a +569
                          if (!value.startsWith('+569')) {
                            value = '+569';
                          }
                          // Solo permite números después del prefijo
                          const numbers = value.slice(4).replace(/\D/g, '');
                          setClientPhone('+569' + numbers.slice(0, 8));
                        }}
                        placeholder="912345678"
                        className="border-2"
                      />
                    </Form.Group>

                                    <Button
                  onClick={handleBooking}
                  size="lg"
                  className="booking-btn" 
                >
                  Reservar Hora →
                </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

      </Container>

      <ProfessionalCVModal
        show={showCVModal}
        onHide={() => setShowCVModal(false)}
        professional={professional}
  />
      </>
        );


  
}
export default ProfessionalDetail;