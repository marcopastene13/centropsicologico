import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfessionals } from '../services/api';

const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const res = await getProfessionals();
                setProfessionals(Array.isArray(res) ? res : (res.data || res.profesionales || []));
      } catch (err) {
        console.error(err);
        toast.error('No se pudo cargar el equipo de profesionales.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfesionales();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando equipo...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-2" style={{ color: '#9271c2' }}>
        Nuestro Equipo
      </h1>
      <p className="text-center text-muted mb-5">
        Profesionales comprometidos con tu bienestar mental
      </p>

      <Row className="g-4 justify-content-center">
        {professionals.map((pro) => (
          <Col key={pro.id} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              {pro.foto && (
                <Card.Img
                  variant="top"
                  src={pro.foto}
                  alt={`Foto de ${pro.nombre}`}
                  style={{ height: '280px', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="fw-bold mb-1" style={{ color: '#333' }}>
                  {pro.nombre}
                </Card.Title>
                <p className="text-muted small mb-3" style={{ color: '#9271c2' }}>
                  {pro.especialidad}
                </p>
                <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                  {pro.descripcion}
                </Card.Text>
                <div className="mt-3">
                  <Button
                    as={Link}
                    to={`/profesionales/${pro.id}`}
                    variant="primary"
                    className="w-100"
                    style={{ backgroundColor: '#9271c2', border: 'none', borderRadius: '8px' }}
                  >
                    Ver Perfil y Reservar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <p className="text-muted">
          ¿No sabes con quien agendar?{' '}
          <Link to="/contacto" style={{ color: '#9271c2' }}>
            Contáctanos y te orientamos
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default ProfessionalsPage;
