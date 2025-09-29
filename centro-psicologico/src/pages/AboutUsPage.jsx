import { Container, Row, Col, Card } from "react-bootstrap";

const teamValues = [
  {
    title: "Compromiso",
    desc: "Nos comprometemos con el bienestar integral de cada paciente, ofreciendo atención personalizada y de calidad.",
    icon: "🤝"
  },
  {
    title: "Profesionalismo",
    desc: "Nuestro equipo cuenta con la formación y experiencia necesaria para brindar el mejor servicio.",
    icon: "👨‍⚕️"
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

export default function AboutUsPage() {
  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Sobre Nosotros</h1>
        <p className="lead">
          Conoce más sobre nuestra misión, visión y el equipo que trabaja por tu bienestar
        </p>
      </div>

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
                Brindar servicios de psicología de alta calidad, centrados en la persona, 
                para promover el bienestar mental y emocional de nuestros pacientes. 
                Nos enfocamos en crear un espacio seguro donde cada individuo pueda 
                encontrar las herramientas necesarias para su crecimiento personal.
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
                Ser reconocidos como el centro psicológico de referencia en la región, 
                caracterizados por la excelencia en nuestros servicios, la calidez humana 
                y el compromiso con la salud mental de nuestra comunidad. Aspiramos a 
                contribuir activamente en la construcción de una sociedad más saludable emocionalmente.
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
                  El Centro Psicológico Centenario nació en 2020 con el objetivo de 
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
