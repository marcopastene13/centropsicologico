import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const professionals = [
  {
    id: 1,
    name: "Patricia Santander",
    desc: "Psicóloga clínica especializada en terapia de adultos y manejo de ansiedad. 10 años de experiencia.",
    img: "/images/patty.jpg",
    specialties: ["Ansiedad", "Depresión", "Terapia de adultos"]
  },
  {
    id: 2,
    name: "Yasna Valdes",
    desc: "Psicólogo infantil y adolescente con enfoque en terapia familiar. Especialista en TDAH.",
    img: "/images/carlos.jpg",
    specialties: ["Psicología infantil", "TDAH", "Terapia familiar"]
  },
  {
    id: 3,
    name: "Stephany Troncoso",
    desc: "Psicólogo infantil y adolescente con enfoque en terapia familiar. Especialista en TDAH.",
    img: "/images/stephany.jpg",
    specialties: ["Psicología infantil", "TDAH", "Terapia familiar"]
  }
];

export default function ProfessionalsPage() {
  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Nuestros Profesionales</h1>
        <p className="lead">Equipo especializado comprometido con tu bienestar</p>
      </div>
      
      <Row>
        {professionals.map((pro) => (
          <Col md={4} key={pro.id} className="mb-4">
            <Card className="custom-card h-100">
              {pro.img && (
                <Card.Img
                  variant="top"
                  src={pro.img}
                  alt={`Foto de ${pro.name}`}
                  style={{ height: "300px", objectFit: "cover" }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">{pro.name}</Card.Title>
                <Card.Text className="mb-3">{pro.desc}</Card.Text>
                
                <div className="mb-3">
                  <h6>Especialidades:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {pro.specialties.map((specialty, index) => (
                      <span key={index} className="badge bg-light text-dark border">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="d-flex gap-2 justify-content-center">
                    <Button as={Link} to={`/profesionales/${pro.id}`} variant="primary">
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="text-center mt-5">
        <Button href="/contact" variant="outline-primary" size="lg">
          ¿No encuentras lo que buscas? Contáctanos
        </Button>
      </div>
    </Container>
  );
}
