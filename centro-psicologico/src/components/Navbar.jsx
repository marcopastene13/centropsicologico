import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function AppNavbar() {
  return (
    <Navbar expand="md" bg="light" variant="light" sticky="top" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              src="/logo192.png"
              height="38px"
              className="d-inline-block align-top me-2"
              alt="Centro Psicológico Centenario"

            />
            Centenario
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/profesionales">
              <Nav.Link>Profesionales</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/sobrenosotros">
              <Nav.Link>Sobre Nosotros</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contacto">
              <Nav.Link>Contacto</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
