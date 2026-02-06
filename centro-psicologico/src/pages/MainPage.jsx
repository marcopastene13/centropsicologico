import { Container, Row, Col, Card, Button, Carousel, Nav } from "react-bootstrap";
import { externalArticles } from "../data/externalArticles";
import { useState } from "react";
import "../styles/MainPage.css";

// Definir servicios disponibles
const allServices = [
  {
    id: "adultos",
    title: "Psicoterapia adultos",
    desc: "Acompañamiento en crisis, ansiedad, depresión y procesos de cambio vital.",
    icon: "👤",
  },
  {
    id: "infantil",
    title: "Psicoterapia infantil y adolescente",
    desc: "Intervención especializada para niños, niñas y jóvenes, junto a sus familias.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "pareja",
    title: "Terapia de pareja",
    desc: "Apoyo en conflictos de pareja, comunicación y proyectos de vida en común.",
    icon: "💑",
  },
  {
    id: "online",
    title: "Atención online",
    desc: "Sesiones remotas para facilitar tu acceso a apoyo psicológico desde donde estés.",
    icon: "💻",
  },
];

// Profesionales con sus servicios asociados
const professionals = [
  {
    id: 1,
    name: "Patricia Santander",
    desc: "Psicóloga clínica especializada en terapia de adultos y manejo de ansiedad.",
    img: "/images/patty.jpg",
    services: ["adultos", "pareja", "online"], // servicios que ofrece
  },
  {
    id: 2,
    name: "Yasna Valdes",
    desc: "Psicólogo infantil y adolescente con enfoque en terapia familiar.",
    img: "/images/yasna.jpg",
    services: ["infantil", "pareja", "online"],
  },
  {
    id: 3,
    name: "Stephany Troncoso",
    desc: "Especialista en terapia de pareja y psicología organizacional.",
    img: "/images/stephany.jpg",
    services: ["infantil", "pareja"],
  },
];

export default function MainPage() {
  const [selectedService, setSelectedService] = useState("adultos");

  // Filtrar profesionales que ofrecen el servicio seleccionado
  const professionalsForService = professionals.filter((pro) =>
    pro.services.includes(selectedService)
  );

  return (
    <div className="mainpage-container">
      <Container>
        {/* HERO */}
        <section className="jumbotron-section">
          <div className="jumbotron-background" />
          <div className="jumbotron-content text-center">
            <h1 className="jumbotron-title">Centro Psicológico Centenario</h1>
            <p className="jumbotron-subtitle">
              Equilibrio y bienestar para tu vida
            </p>
            <p className="jumbotron-lead">
              Un equipo de psicólogos en Maipú dedicado a acompañarte en tus
              momentos difíciles, con atención ética, cercana y profesional.
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-3">
              <Button
                size="lg"
                href="/contacto"
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
        </section>

        {/* SERVICIOS + PROFESIONALES INTEGRADOS */}
        <section className="services-professionals-section mt-5">
          <h2 className="section-title mb-4 text-center">
            Nuestros servicios y profesionales
          </h2>
          <p className="text-center mb-4">
            Elige el servicio que necesitas y conoce a los profesionales que lo ofrecen.
          </p>

          {/* Tabs de servicios */}
          <div className="services-tabs-container mb-5">
            <Nav
              variant="pills"
              className="justify-content-center flex-wrap gap-2 services-nav"
              activeKey={selectedService}
              onSelect={(k) => setSelectedService(k)}
            >
              {allServices.map((service) => (
                <Nav.Item key={service.id}>
                  <Nav.Link eventKey={service.id} className="service-pill">
                    <span className="service-icon">{service.icon}</span>
                    <span className="service-label">{service.title}</span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          {/* Descripción del servicio seleccionado */}
          <div className="service-description mb-5">
            <Card className="custom-card bg-light">
              <Card.Body>
                <p className="lead mb-0">
                  {allServices.find((s) => s.id === selectedService)?.desc}
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Profesionales que ofrecen el servicio */}
          <div className="professionals-for-service">
            <h5 className="mb-4 text-center">
              {professionalsForService.length > 0
                ? `Profesionales especializados en ${
                    allServices.find((s) => s.id === selectedService)?.title
                  }`
                : "No hay profesionales disponibles para este servicio"}
            </h5>
            <Row>
              {professionalsForService.map((pro) => (
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
                        <Button
                          variant="success"
                          href={`/profesionales/${pro.id}#reservar`}
                          className="flex-grow-1"
                        >
                          Agendar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* SOBRE NOSOTROS + ARTÍCULOS */}
        <section className="about-news-section mt-5 mb-5">
          <Row className="align-items-stretch">
            <Col md={6} className="mb-4 d-flex flex-column">
              <h3 className="section-subtitle mb-4">Sobre nosotros</h3>
              <Card className="custom-card about-card flex-grow-1">
                <div className="p-4">
                  Somos un equipo multidisciplinario dedicado a tu bienestar
                  emocional. Brindamos atención personalizada y profesional
                  para acompañarte en tu proceso de crecimiento, ofreciendo un
                  espacio seguro, ético y respetuoso para impulsar cambios
                  positivos en tu vida.
                </div>
                <Card.Footer className="bg-transparent border-0 mt-auto">
                  <Button
                    href="/sobrenosotros"
                    variant="primary"
                    className="mt-3 w-100"
                  >
                    Conocer más
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            <Col md={6} className="mb-4 d-flex flex-column">
              <h3 className="section-subtitle mb-4">Artículos recientes</h3>

              {/* Grid en desktop */}
              <Row className="g-3 d-none d-md-flex">
                {externalArticles.slice(0, 3).map((a, i) => (
                  <Col md={4} key={i} className="d-flex">
                    <Card className="custom-card article-card h-100 d-flex flex-column">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="mb-2">{a.title}</Card.Title>
                        <Card.Text className="text-muted mb-3">
                          {a.desc}
                        </Card.Text>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <small className="text-muted">{a.source}</small>
                          <Button
                            as="a"
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline-primary"
                            size="sm"
                          >
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
                          <Card.Text className="text-muted mb-3">
                            {a.desc}
                          </Card.Text>
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <small className="text-muted">{a.source}</small>
                            <Button
                              as="a"
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="outline-primary"
                              size="sm"
                            >
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
