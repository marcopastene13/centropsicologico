import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import WhatsAppFloat from '../components/WhatsAppFloat';
import WhyChooseUs from '../components/WhyChooseUs';
import "../styles/MainPage.css";

const professionals = [
    {
        id: 1,
        name: "Patricia Santander",
        desc: "Psicóloga clínica especializada en terapia de adultos y manejo de ansiedad.",
        img: "/images/professionals/patty.jpg",
    },
    {
        id: 2,
        name: "Yasna Valdes",
        desc: "Psicólogo infantil y adolescente con enfoque en terapia familiar.",
        img: "/images/professionals/yasna.jpg",
    },
    {
        id: 3,
        name: "Stephany Troncoso",
        desc: "Especialista en terapia de pareja y psicología organizacional.",
        img: "/images/professionals/stephany.jpg",
    },
];

const services = [
    {
        id: 1,
        title: "Psicoterapia adultos",
        desc: "Acompañamiento en crisis, ansiedad, depresión y procesos de cambio vital.",
    },
    {
        id: 2,
        title: "Psicoterapia infantil y adolescente",
        desc: "Intervención especializada para niños, niñas y jóvenes, junto a sus familias.",
    },
    {
        id: 3,
        title: "Terapia de pareja",
        desc: "Apoyo en conflictos de pareja, comunicación y proyectos de vida en común.",
    },
    {
        id: 4,
        title: "Atención online",
        desc: "Sesiones remotas para facilitar tu acceso a apoyo psicológico desde donde estés.",
    },
];

export default function MainPage() {
    return (
        <div className="mainpage-container">
            <Container>
                {/* HERO */}
                <section className="jumbotron-section">
                    <div className="jumbotron-background" />
                    <div className="jumbotron-content text-center">
                        <h1 className="jumbotron-title">Centro Psicológico Centenario</h1>
                        <p className="jumbotron-subtitle">
                            "Encuentra el equilibrio emocional que mereces"
                        </p>
                        <p className="jumbotron-lead">
                            "Especialistas en terapia individual, familiar y pericial."
                            <p className="jumbotron-lead">
                                "Atención psicológica presencial y online en Maipú"
                            </p>
                        </p>

                        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-3">
                            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-3">
                                <Button
                                    size="lg"
                                    href="/profesionales"
                                    variant="success"
                                    className="cta-button hero-btn"
                                >
                                    Agendar hora
                                </Button>

                                <Button
                                    size="lg"
                                    href="/sobrenosotros"
                                    variant="outline-success"
                                    className="hero-secondary-btn hero-btn"
                                >
                                    Conocer el centro
                                </Button>
                            </div>


                        </div>
                    </div>
                </section>

                <WhyChooseUs />
                {/* SERVICIOS */}
                <section className="services-section mt-5">
                    <h2 className="section-title mb-4 text-center">Nuestros servicios</h2>
                    <p className="text-center mb-4">
                        Ofrecemos diferentes modalidades de atención para adaptarnos a tus
                        necesidades y a las de tu familia.
                    </p>
                    <Row>
                        {services.map((service) => (
                            <Col md={3} sm={6} key={service.id} className="mb-4">
                                <Card className="custom-card service-card h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{service.title}</Card.Title>
                                        <Card.Text className="flex-grow-1">
                                            {service.desc}
                                        </Card.Text>
                                        <Button
                                            variant="outline-success"
                                            href="/contacto"
                                            className="mt-3"
                                        >
                                            Consultar por este servicio
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* PROFESIONALES */}
                <section className="professionals-section mt-5">
                    <h2 className="section-title mb-4 text-center">
                        Nuestros profesionales
                    </h2>
                    <Row>
                        {professionals.map((pro) => (
                            <Col md={4} key={pro.id} className="mb-4">
                                <Card className="custom-card professional-card d-flex flex-column h-100">
                                    {pro.img && (
                                        <Card.Img
                                            variant="top"
                                            src={pro.img}
                                            alt={`Foto de ${pro.name}`}
                                        />
                                    )}
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{pro.name}</Card.Title>
                                        <Card.Text>{pro.desc}</Card.Text>
                                        <div className="mt-auto d-flex gap-2">
                                            <Button
                                                variant="primary"
                                                href={`/profesionales/${pro.id}`}
                                                className="flex-grow-1"
                                            >
                                                Ver perfil
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* SOBRE NOSOTROS + TESTIMONIOS */}
                {/* Sección: Sobre Nosotros y Testimonios - Dos cards lado a lado */}
                <section className="about-testimonials-section">
                    <Container>
                        <Row className="g-4">
                            {/* Card izquierda: Sobre Nosotros */}
                            <Col md={6}>
                                <Card className="about-card h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <h3 className="card-title-custom mb-3">Sobre nosotros</h3>
                                        <p className="card-text-custom">
                                            Somos un equipo multidisciplinario dedicado a tu bienestar emocional.
                                            Brindamos atención personalizada y profesional para acompañarte en tu
                                            proceso de crecimiento, ofreciendo un espacio seguro, ético y respetuoso
                                            para impulsar cambios positivos en tu vida.
                                        </p>
                                        <Button
                                            as={Link}
                                            to="/sobre-nosotros"
                                            variant="success"
                                            className="mt-auto"
                                        >
                                            Conocer más →
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Card derecha: Testimonios */}
                            <Col md={6}>
                                <Card className="testimonials-card h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <h3 className="card-title-custom mb-3">Lo que dicen nuestros pacientes</h3>

                                        <Carousel
                                            interval={7000}
                                            indicators={false}
                                            controls={false}
                                            className="flex-grow-1"
                                        >
                                            {[
                                                {
                                                    id: 1,
                                                    name: 'Ita Sanz',
                                                    rating: 5,
                                                    text: 'Recomiendo un 1000%, te escuchan y te orientan a problemas donde uno no ve soluciones.',
            
                                                },
                                                {
                                                    id: 2,
                                                    name: 'Julio César',
                                                    rating: 5,
                                                    text: 'Trabajo serio y profesional. Patricia ejerce su carrera desde una verdadera vocación humanista.',
                                                }
                                            ].map((testimonial) => (
                                                <Carousel.Item key={testimonial.id}>
                                                    <div className="testimonial-content-card">
                                                        <div className="rating-stars-card mb-2">
                                                            {[...Array(5)].map((_, index) => (
                                                                <span key={index} className={`star ${index < testimonial.rating ? 'filled' : ''}`}>
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="testimonial-text-card">
                                                            "{testimonial.text}"
                                                        </p>
                                                        <div className="testimonial-author-card">
                                                            <span className="author-name">{testimonial.name}</span>
                                                            <span className="mx-2">·</span>
                                                        </div>
                                                    </div>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>

                                        <div className="text-center mt-3">
                                            <a
                                                href="https://www.facebook.com/psicologasmaipu"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="view-more-link"
                                            >
                                                Ver más reseñas →
                                            </a>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>


            </Container>
        </div >
    );
}
