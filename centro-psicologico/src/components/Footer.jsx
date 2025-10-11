import { Container, Row, Col } from "react-bootstrap";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer text-muted py-4 mt-5">
      <Container>
        <Row className="text-center">
          <Col md={4} className="mb-3 d-flex flex-column align-items-center">
            <h5 className="text-dark">Centro Psicológico Centenario</h5>
            <p>
              General Ordoñez 155 of.1104<br />
              Tel: +56 9 1234 5678<br />
              Email: <a href="mailto:cconsultapsicologica@gmail.com" className="text-muted text-decoration-none">cconsultapsicologica@gmail.com</a>
            </p>
          </Col>

          <Col md={4} className="mb-3 d-flex flex-column align-items-center">
            <h5 className="text-dark">Enlaces</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Inicio</a></li>
              <li><a href="/profesionales" className="text-muted text-decoration-none">Profesionales</a></li>
              <li><a href="/sobrenosotros" className="text-muted text-decoration-none">Sobre Nosotros</a></li>
              <li><a href="/contacto" className="text-muted text-decoration-none">Contacto</a></li>
            </ul>
          </Col>

          <Col md={4} className="mb-3 d-flex flex-column align-items-center">
            <h5 className="text-dark">Síguenos</h5>
            <div className="d-flex gap-3 justify-content-center">
              <a href="https://www.facebook.com/psicologasmaipu/" target="_blank" rel="noopener noreferrer" className="text-muted fs-4">
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

        <div className="text-center small mt-2" style={{ opacity: 0.6 }}>
          Sitio web desarrollado por{" "}
          <a
            href="https://www.linkedin.com/in/marcopastene"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6b6b6b", textDecoration: "underline dotted", fontWeight: 600 }}
          >
            Marco Pastene 
          </a>
        </div>
      </Container>
    </footer>
  );
}
