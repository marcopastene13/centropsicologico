import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar expand="md" bg="light" variant="light" sticky="top" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="brand-stacked d-flex align-items-center">
            <img
              src="/logo192.png"
              height="64"
              alt="Centro Psicológico Centenario"
              className="me-2"
            />
            <span className="brand-text">
              <span>Centro</span>
              <span>Psicológico</span>
              <span>Centenario</span>
            </span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <LinkContainer to="/"><Nav.Link>Inicio</Nav.Link></LinkContainer>
            <LinkContainer to="/profesionales"><Nav.Link>Profesionales</Nav.Link></LinkContainer>
            <LinkContainer to="/sobrenosotros"><Nav.Link>Sobre Nosotros</Nav.Link></LinkContainer>
            <LinkContainer to="/contacto"><Nav.Link>Contacto</Nav.Link></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
