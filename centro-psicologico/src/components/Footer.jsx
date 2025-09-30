import { Container, Row, Col } from "react-bootstrap";
import "../styles/Footer.css";


export default function Footer() {
  return (
    <footer className="footer text-muted py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="text-dark">Centro Psicológico Centenario</h5>
            <p>
              Av. Libertador 123, Osorno<br />
              Tel: +56 9 1234 5678<br />
              Email: consultapsicologica@gmail.com
            </p>
          </Col>

          <Col md={4} className="mb-3">
            <h5 className="text-dark">Enlaces útiles</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Inicio</a></li>
              <li><a href="/profesionales" className="text-muted text-decoration-none">Profesionales</a></li>
              <li><a href="/sobrenosotros" className="text-muted text-decoration-none">Sobre Nosotros</a></li>
              <li><a href="/contacto" className="text-muted text-decoration-none">Contacto</a></li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h5 className="text-dark">Síguenos</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted fs-4">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="text-center small">
          © {new Date().getFullYear()} Centro Psicológico Centenario. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}
