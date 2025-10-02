import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { externalArticles } from "../data/externalArticles";
import "../styles/MainPage.css";

const professionals = [
    {
        id: 1,
        name: "Patricia Santander",
        desc: "Psicóloga clínica especializada en terapia de adultos y manejo de ansiedad.",
        img: "/images/patty.jpg"
    },
    {
        id: 2,
        name: "Yasna Valdes",
        desc: "Psicólogo infantil y adolescente con enfoque en terapia familiar.",
        img: "/images/yasna.jpg"
    },
    {
        id: 3,
        name: "Stephany Troncoso",
        desc: "Especialista en terapia de pareja y psicología organizacional.",
        img: "/images/stephany.jpg"
    }
];

export default function MainPage() {
    return (
        <div className="mainpage-container">
            <Container>
                {/* Jumbotron con logo de fondo */}
                <section className="jumbotron-section">
                    <div className="jumbotron-background" />
                    <div className="jumbotron-content text-center">
                        <h1 className="jumbotron-title">Centro Psicológico Centenario</h1>
                        <p className="jumbotron-subtitle">
                            Equilibrio y bienestar para tu vida
                        </p>
                        <Button size="lg" href="/profesionales" variant="success" className="cta-button">
                            Agenda tu cita
                        </Button>
                    </div>
                </section>

                {/* Sección profesionales */}
                <section className="professionals-section mt-5">
                    <h2 className="section-title mb-4 text-center">Nuestros Profesionales</h2>
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
                                    <Card.Body>
                                        <Card.Title>{pro.name}</Card.Title>
                                        <Card.Text>{pro.desc}</Card.Text>
                                        <div className="mt-auto d-flex gap-2">
                                            <Button
                                                variant="primary"
                                                href={`/profesionales/${pro.id}`}
                                                className="flex-grow-1"
                                            >
                                                Ver Perfil
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Sección acerca y noticias */}
                <section className="about-news-section mt-5 mb-5">
                    <Row className="align-items-stretch">
                        <Col md={6} className="mb-4 d-flex flex-column">
                            <h3 className="section-subtitle mb-4">Sobre Nosotros</h3>
                            <Card className="custom-card about-card flex-grow-1">
                                <div className="p-4">
                                    Somos un equipo multidisciplinario comprometido con tu bienestar
                                    mental y emocional. Nuestro objetivo es brindar atención personalizada
                                    y un entorno seguro para cada paciente.
                                </div>
                                <Card.Footer className="bg-transparent border-0 mt-auto">
                                    <Button href="/sobrenosotros" variant="primary" className="mt-3 w-100">
                                        Conocer más
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>

                        <Col md={6} className="mb-4 d-flex flex-column">
                            <h3 className="section-subtitle mb-3">Artículos Recientes</h3>

                            {/* Grid 3 columnas en md+ */}
                            {/* Grid 3 columnas en md+ */}
                            <Row className="g-3 d-none d-md-flex">
                                {externalArticles.slice(0, 3).map((a, i) => (
                                    <Col md={4} key={i} className="d-flex">
                                        <Card className="custom-card article-card h-100 d-flex flex-column">
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="mb-2">{a.title}</Card.Title>
                                                <Card.Text className="text-muted mb-3">{a.desc}</Card.Text>
                                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">{a.source}</small>
                                                    <Button as="a" href={a.url} target="_blank" rel="noopener noreferrer" variant="outline-primary" size="sm">
                                                        Leer artículo
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* Carrusel en móvil */}
                            <div className="d-md-none">
                                <Carousel interval={5000} indicators>
                                    {externalArticles.slice(0, 3).map((a, i) => (
                                        <Carousel.Item key={i}>
                                            <Card className="custom-card article-card mx-2">
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title className="mb-2">{a.title}</Card.Title>
                                                    <Card.Text className="text-muted mb-3">{a.desc}</Card.Text>
                                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">{a.source}</small>
                                                        <Button as="a" href={a.url} target="_blank" rel="noopener noreferrer" variant="outline-primary" size="sm">
                                                            Leer artículo
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>

                        </Col>
                    </Row>
                </section>
            </Container>
        </div>
    );
}