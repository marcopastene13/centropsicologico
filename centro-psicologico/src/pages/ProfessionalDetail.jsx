import { Container, Button, Row, Col, Card } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import { useState } from "react";

const professionals = [
    {
        id: 1,
        name: "Patricia Santander",
        title: "Psicóloga Clínica",
        img: "/images/patty.jpg",
        whatsapp: "56986431293",
        bio: "Psicóloga Clínica cofundadora en Centro de salud Santander&Valdes. Spa Diploma Internacional en Estrategias Clínicas en Psicoterapia Breve. Diploma Perito en ámbito judicial. UNAB",
        specialties: ["Trastornos de Ansiedad", "Depresión", "Terapia Cognitivo-Conductual", "Terapia de Adultos"],
        education: [
            "Diplomado en Peritaje Psicológico y Social en Contexto Judicial | Universidad Andrés Bello (UNAB) | 2023",
            "Diplomado Internacional Estrategias Clínicas Terapia Breve | ADIPA | 2021",
            "Curso Peritaje Psicológico en contexto familiar  | Instituto Virtulys | 2021",
            "Curso Psicopatología Forense: Herramientas para la Evaluación Pericial Psicológica | Instituto Grupo Palermo | 2018",
            "Título Profesional de Psicóloga con Grado Académico de Licenciada en Psicología | Universidad de Las Américas(UDLA) | 2015", 
            "Seminario “Psicología Forense y Jurídica” | Universidad Bernardo O'Higgins (UBO) | 2015",
            "Seminario “Expresiones de la Violencia de Género” | Universidad de Concepción (UDC) | 2015",
            "Seminario “Autocuidado y Manejo de las Emociones en Niños Preadolescentes” | Universidad de Las Américas(UDLA) | 2013", 
            "Seminario “Apego en la Primera Infancia” | Universidad de Chile (UDCH) | 2012",
            "Cátedra Grafología | Universidad de Las Américas (UDLA) | 2012"
        ],
        schedule: "Lunes a Viernes: 9:00 - 17:00"
    },
    {
        id: 2,
        name: "Yasna Valdes",
        title: "Psicólogo Infantil",
        img: "/images/carlos.jpg",
        whatsapp: "56987654321",
        bio: "Especialista en psicología infantil y adolescente con enfoque en terapia familiar. Experto en el tratamiento de TDAH, trastornos del espectro autista y problemas de conducta.",
        specialties: ["Psicología Infantil", "TDAH", "Trastornos del Espectro Autista", "Terapia Familiar"],
        education: [
            "Psicólogo, Universidad Católica (2010)",
            "Magíster en Psicología Infantil, UDP (2013)",
            "Certificación en Terapia ABA (2016)"
        ],
        schedule: "Martes a Sábado: 10:00 - 18:00"
    },
    {
        id: 3,
        name: "Stephany Troncoso",
        title: "Psicólogo Infantil",
        img: "/images/stephany.jpg",
        whatsapp: "56987654321",
        bio: "Especialista en psicología infantil y adolescente con enfoque en terapia familiar. Experto en el tratamiento de TDAH, trastornos del espectro autista y problemas de conducta.",
        specialties: ["Psicología Infantil", "TDAH", "Trastornos del Espectro Autista", "Terapia Familiar"],
        education: [
            "Psicólogo, Universidad Católica (2010)",
            "Magíster en Psicología Infantil, UDP (2013)",
            "Certificación en Terapia ABA (2016)"
        ],
        schedule: "Martes a Sábado: 10:00 - 18:00"
    }
];

export default function ProfessionalDetail() {
    const { id } = useParams();
    const professional = professionals.find((p) => p.id === parseInt(id));
    const [selectedDate, setSelectedDate] = useState(new Date());

    if (!professional) {
        return (
            <Container className="mt-4">
                <Card className="custom-card text-center">
                    <Card.Body>
                        <h2>Profesional no encontrado</h2>
                        <p>El profesional que buscas no existe o ha sido removido.</p>
                        <Button href="/professionals" variant="primary">
                            Ver todos los profesionales
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const whatsappMessage = `Hola ${professional.name}, quiero agendar una sesión para el ${selectedDate.toLocaleDateString()}`;

    return (
        <Container className="mt-4">
            <Row>
                {/* Información del profesional */}
                <Col md={8}>
                    <Card className="custom-card mb-4">
                        <Row className="g-0">
                            {professional.img && (
                                <Col md={4}>
                                    <Card.Img
                                        src={professional.img}
                                        alt={`Foto de ${professional.name}`}
                                        style={{ height: "300px", objectFit: "cover" }}
                                        className="rounded-start"
                                    />
                                </Col>
                            )}
                            <Col md={professional.img ? 8 : 12}>
                                <Card.Body>
                                    <Card.Title as="h1">{professional.name}</Card.Title>
                                    <Card.Subtitle className="mb-3 text-muted">
                                        {professional.title}
                                    </Card.Subtitle>
                                    <Card.Text>{professional.bio}</Card.Text>

                                    <div className="mb-3">
                                        <h6>Horarios de Atención:</h6>
                                        <p className="text-muted">{professional.schedule}</p>
                                    </div>

                                    <Button
                                        href={`https://wa.me/${professional.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="success"
                                        size="lg"
                                    >
                                        Contactar por WhatsApp
                                    </Button>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>

                    {/* Especialidades */}
                    <Card className="custom-card mb-4">
                        <Card.Body>
                            <Card.Title>Especialidades</Card.Title>
                            <div className="d-flex flex-wrap gap-2">
                                {professional.specialties.map((specialty, index) => (
                                    <span key={index} className="badge bg-primary fs-6">
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Formación académica */}
                    <Card className="custom-card">
                        <Card.Body>
                            <Card.Title>Formación Académica</Card.Title>
                            <ul className="list-unstyled">
                                {professional.education.map((edu, index) => (
                                    <li key={index} className="mb-2">
                                        <span className="text-primary">•</span> {edu}
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Calendario de reservas */}
                <Col md={4}>
                    <Card className="custom-card sticky-top">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                Reservar Sesión
                            </Card.Title>

                            <div className="mb-4">
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    className="mx-auto"
                                />
                            </div>

                            <div className="text-center mb-3">
                                <small className="text-muted">
                                    Fecha seleccionada: <br />
                                    <strong>{selectedDate.toLocaleDateString()}</strong>
                                </small>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    href={`https://wa.me/${professional.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="success"
                                    size="lg"
                                >
                                    Confirmar Cita
                                </Button>

                                <Button
                                    href={`https://wa.me/${professional.whatsapp}?text=${encodeURIComponent("Hola, tengo algunas preguntas sobre la terapia")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="outline-primary"
                                >
                                    Hacer Consulta
                                </Button>
                            </div>

                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    Al hacer clic confirmarás tu interés via WhatsApp
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
