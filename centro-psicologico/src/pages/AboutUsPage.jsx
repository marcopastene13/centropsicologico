import { Container, Row, Col, Card, Carousel } from "react-bootstrap";
import { Helmet } from 'react-helmet-async';

const teamValues = [
  {
    title: "Compromiso",
    desc: "Nos comprometemos con el bienestar integral de cada paciente, ofreciendo atención personalizada y de calidad.",
    icon: "🤝"
  },
  {
    title: "Profesionalismo",
    desc: "Nuestro equipo cuenta con la formación y experiencia necesaria para brindar el mejor servicio.",
    icon: "👩🏻‍⚕️"
  },
  {
    title: "Confidencialidad",
    desc: "Garantizamos un ambiente seguro y confidencial para que te sientas cómodo compartiendo.",
    icon: "🔒"
  },
  {
    title: "Empatía",
    desc: "Entendemos que cada persona es única y merece ser tratada con respeto y comprensión.",
    icon: "❤️"
  }
];

const fotosCentro = [
  '/images/centro1.jpg',
  '/images/centro2.jpg',
  '/images/centro3.jpg',
  '/images/centro4.jpg'
];

export default function AboutUsPage() {
  return (
    <Container className="mt-4">
      <Helmet>
        <title>Sobre Nosotros | Centro Psicológico Centenario, Maipú</title>
        <meta name="description" content="Conoce al Centro Psicológico Centenario en Maipú: nuestra misión, valores y el equipo de psicólogas que trabaja por tu bienestar emocional." />
        <link rel="canonical" href="https://www.centropsicologicocentenario.cl/sobrenosotros" />
      </Helmet>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Sobre Nosotros — Centro Psicológico en Maipú</h1>
        <p className="lead">
          Conoce más sobre nuestro centro, nuestra misión, visión y el equipo que trabaja por tu bienestar
        </p>
      </div>

      {/* ✅ CARRUSEL MEJORADO */}
      <h2 className="text-center mb-4">Nuestro Centro</h2>
      <Row className="justify-content-center mb-5">
        <Col lg={6} md={8} xs={12}>
          <Carousel className="carousel-card" indicators={true} controls={true}>
            {fotosCentro.map((src, idx) => (
              <Carousel.Item key={src}>
                <Card className="custom-card carousel-card-item">
                  <div className="carousel-image-wrapper">
                    <Card.Img 
                      variant="top" 
                      src={src} 
                      alt={`Centro Psicológico ${idx + 1}`}
                      className="carousel-image"
                    />
                  </div>
                </Card>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      {/* Misión y Visión */}
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="custom-card h-100">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <span style={{ fontSize: "2rem" }}>🎯</span>
                <h3 className="mt-2">Nuestra Misión</h3>
              </Card.Title>
              <Card.Text>
                En el Centro Psicológico Centenario trabajamos por el bienestar integral de las personas,
                promoviendo procesos terapéuticos basados en la empatía, la contención y la evidencia científica.
                Nuestro propósito es acompañar a niños, adolescentes, adultos y familias en sus procesos de cambio,
                reparación y crecimiento emocional, contribuyendo a una salud mental accesible, ética y humana.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="custom-card h-100">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <span style={{ fontSize: "2rem" }}>👁️</span>
                <h3 className="mt-2">Nuestra Visión</h3>
              </Card.Title>
              <Card.Text>
                Ser un referente en atención psicológica integral y humanizada,
                reconocidos por nuestro compromiso con la calidad, la calidez y la innovación terapéutica.
                Aspiramos a construir un espacio donde la salud mental sea prioridad, fomentando comunidades más conscientes,
                empáticas y emocionalmente sanas.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Valores */}
      <div className="mb-5">
        <h2 className="text-center mb-4">Nuestros Valores</h2>
        <Row>
          {teamValues.map((value, index) => (
            <Col md={3} sm={6} key={index} className="mb-4">
              <Card className="custom-card text-center h-100">
                <Card.Body>
                  <div style={{ fontSize: "3rem" }} className="mb-3">
                    {value.icon}
                  </div>
                  <Card.Title>{value.title}</Card.Title>
                  <Card.Text>{value.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Historia */}
      <Row className="mb-5">
        <Col>
          <Card className="custom-card">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h3>Nuestra Historia</h3>
              </Card.Title>
              <Card.Text>
                <p>
                  El Centro Psicológico Centenario nació en 2015 con el objetivo de
                  ofrecer servicios de salud mental accesibles y de calidad a nuestra comunidad.
                  Desde nuestros inicios, hemos mantenido un enfoque integral que considera
                  las necesidades únicas de cada paciente.
                </p>
                <p>
                  Nuestro equipo multidisciplinario ha crecido con el paso del tiempo,
                  incorporando profesionales especializados en diferentes áreas de la psicología.
                  Esto nos permite ofrecer un amplio rango de servicios, desde terapia individual
                  hasta intervenciones familiares y organizacionales.
                </p>
                <p>
                  Hoy en día, continuamos comprometidos con la innovación y la mejora continua,
                  adaptándonos a las necesidades cambiantes de nuestros pacientes y manteniendo
                  siempre la calidad humana que nos caracteriza.
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
