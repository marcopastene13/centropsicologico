import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Button } from 'react-bootstrap';


export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');

      if (!token) {
        setStatus('error');
        setMessage('Token de transacción no encontrado');
        return;
      }

      try {
        const formData = JSON.parse(sessionStorage.getItem('formData'));
        const professional = JSON.parse(sessionStorage.getItem('professional'));
        const selectedDate = sessionStorage.getItem('selectedDate');
        const selectedSlot = sessionStorage.getItem('selectedSlot');
        const buyOrder = sessionStorage.getItem('buyOrder');
        const amount = parseInt(sessionStorage.getItem('amount'), 10);

        // ✅ AQUÍ ESTABA EL ERROR: faltaba asignar response
        const response = await fetch('https://shiny-engine-pjvvrg5xqjx3xvr-3000.app.github.dev/api/payment/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            formData,
            professional,
            selectedDate,
            selectedSlot,
            buyOrder,
            amount,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setMessage('Tu reserva ha sido confirmada. Revisa tu correo para los detalles.');

          // Limpiar sessionStorage
          sessionStorage.clear();
        } else {
          setStatus('failed');
          setMessage('Pago rechazado. Intenta nuevamente.');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setStatus('error');
        setMessage('Error al procesar la confirmación');
      }
    };

    confirmPayment();
  }, [searchParams]);


  return (
    <Container className="mt-5">
      {status === 'loading' && (
        <Card className="text-center">
          <Card.Body>
            <Spinner animation="border" />
            <p className="mt-2">Procesando tu pago...</p>
          </Card.Body>
        </Card>
      )}
      {status === 'success' && (
        <Card className="text-center">
          <Card.Body style={{ borderLeft: '4px solid #28a745' }}>
            <h2 style={{ color: '#28a745' }}>✓ ¡Pago exitoso!</h2>
            <p>{message}</p>
            <Button onClick={() => navigate('/')} variant="success">
              Volver al inicio
            </Button>
          </Card.Body>
        </Card>
      )}
      {status === 'failed' && (
        <Card className="text-center">
          <Card.Body style={{ borderLeft: '4px solid #dc3545' }}>
            <h2 style={{ color: '#dc3545' }}>✗ Pago rechazado</h2>
            <p>{message}</p>
            <Button onClick={() => navigate(-1)} variant="danger">
              Intentar nuevamente
            </Button>
          </Card.Body>
        </Card>
      )}
      {status === 'error' && (
        <Card className="text-center">
          <Card.Body style={{ borderLeft: '4px solid #ffc107' }}>
            <h2 style={{ color: '#ffc107' }}>⚠ Error en la transacción</h2>
            <p>{message}</p>
            <p>Contacta con soporte: <strong>+56 9 3273 6893</strong></p>
            <Button onClick={() => navigate('/')} variant="warning">
              Volver al inicio
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
