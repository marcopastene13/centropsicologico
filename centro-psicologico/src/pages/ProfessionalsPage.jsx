import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getProfessionals } from '../services/api';

const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slowLoad, setSlowLoad] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si tarda mas de 5s, mostrar mensaje de aviso
    const slowTimer = setTimeout(() => setSlowLoad(true), 5000);

    const fetchProfesionales = async () => {
      try {
        const res = await getProfessionals();
        setProfessionals(Array.isArray(res) ? res : (res.data || res.profesionales || []));
        setError(null);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el equipo. Por favor intenta nuevamente.');
        toast.error('No se pudo cargar el equipo de profesionales.');
      } finally {
        setLoading(false);
        clearTimeout(slowTimer);
        setSlowLoad(false);
      }
    };

    fetchProfesionales();
    return () => clearTimeout(slowTimer);
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 fw-semibold" style={{ color: '#9271c2' }}>Cargando equipo...</p>
        {slowLoad && (
          <div className="mt-2 px-3 py-2 rounded" style={{ background: '#f0ebfa', maxWidth: 380 }}>
            <p className="mb-1" style={{ fontSize: '0.9rem', color: '#6c4f9e' }}>
              El servidor esta despertando, esto puede tardar hasta 1 minuto.
            </p>
            <p className="mb-0" style={{ fontSize: '0.85rem', color: '#888' }}>
              Gracias por tu paciencia.
            </p>
          </div>
        )}
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem' }}>😔</div>
        <p className="mt-3" style={{ color: '#e74c3c' }}>{error}</p>
        <Button variant="outline-primary" onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Helmet>
        <title>Nuestros Psicólogos en Maipú | Centro Psicológico Centenario</title>
        <meta name="description" content="Conoce a nuestro equipo de psicólogas en Maipú: terapia individual, de pareja y online. Revisa la especialidad de cada una y agenda tu hora." />
        <link rel="canonical" href="https://www.centropsicologicocentenario.cl/profesionales" />
      </Helmet>
      <h1 className="text-center mb-2" style={{ color: '#9271c2' }}>Nuestro Equipo de Psicólogos en Maipú</h1>
      <p className="text-center text-muted mb-5">Profesionales especializados listos para acompa&ntilde;arte</p>
      <Row className="justify-content-center">
        {professionals.map((pro) => (
          <Col key={pro.id} xs={12} sm={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {pro.foto && (
                <div style={{ height: '260px', overflow: 'hidden', background: '#f5f0ff' }}>
                  <img
                    src={pro.foto}
                    alt={pro.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              <Card.Body className="d-flex flex-column p-4">
                <Card.Title style={{ color: '#5a3d8a', fontWeight: 700 }}>{pro.nombre}</Card.Title>
                <Card.Subtitle className="mb-2" style={{ color: '#9271c2', fontWeight: 500 }}>{pro.especialidad}</Card.Subtitle>
                <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.92rem' }}>{pro.descripcion}</Card.Text>
                <Button
                  as={Link}
                  to={`/profesionales/${pro.id}`}
                  style={{ background: '#9271c2', border: 'none', borderRadius: '8px', fontWeight: 600, marginTop: 'auto' }}
                >
                  Ver Perfil y Reservar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProfessionalsPage;
