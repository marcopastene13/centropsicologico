import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const checkPaymentRef = useRef(false); // ✅ USAR REF PARA EVITAR DUPLICADOS

  useEffect(() => {
    // ✅ SOLO EJECUTAR UNA VEZ
    if (!checkPaymentRef.current) {
      checkPaymentRef.current = true;
      checkPaymentStatus();
    }
  }, []); // ✅ ARRAY VACÍO = SOLO UNA VEZ AL MONTAR

  const checkPaymentStatus = async () => {
    try {
      const token = sessionStorage.getItem('transactionToken');
      
      if (!token) {
        setStatus('error');
        setError('No se encontró la sesión de pago');
        return;
      }

      console.log('Token recibido:', token);

      // Llamar al backend para confirmar el pago
      const response = await fetch('https://shiny-engine-pjvvrg5xqjx3xvr-3000.app.github.dev/api/payment/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          formData: JSON.parse(sessionStorage.getItem('formData')),
          professional: JSON.parse(sessionStorage.getItem('professional')),
          selectedDate: sessionStorage.getItem('selectedDate'),
          selectedSlot: sessionStorage.getItem('selectedSlot'),
          buyOrder: sessionStorage.getItem('buyOrder'),
          amount: parseInt(sessionStorage.getItem('amount')),
        }),
      });

      const data = await response.json();
      console.log('Respuesta commit:', data);

      if (data.success) {
        setStatus('success');
        setPaymentData(data.data);
        sessionStorage.clear();
      } else {
        setStatus('error');
        setError(data.error || 'Error confirmando el pago');
      }

    } catch (err) {
      console.error('Error:', err);
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="custom-card">
        <Card.Body className="text-center">
          {status === 'loading' && (
            <div>
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Verificando pago...</span>
              </Spinner>
              <p>Verificando tu pago...</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <h2 className="text-success mb-3">✓ ¡Pago Exitoso!</h2>
              <Alert variant="success">
                Tu sesión de terapia ha sido agendada correctamente.
              </Alert>
              <p>
                <strong>Código de autorización:</strong> {paymentData?.authorization_code}
              </p>
              <Button href="/professionals" variant="primary" className="mt-3">
                Volver a profesionales
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <h2 className="text-danger mb-3">⚠ Error</h2>
              <Alert variant="danger">{error}</Alert>
              <Button href="/professionals" variant="primary" className="mt-3">
                Volver
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
