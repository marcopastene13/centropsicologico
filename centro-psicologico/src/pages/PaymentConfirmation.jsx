import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const confirmPayment = async () => {
      const token = searchParams.get('token_ws');

      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/payment/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (result.response_code === 0) {
          // Pago exitoso
          const formData = JSON.parse(sessionStorage.getItem('formData'));
          const buyOrder = sessionStorage.getItem('buyOrder');

          // Aquí puedes guardar en base de datos o enviar email
          console.log('Pago confirmado:', { formData, buyOrder, result });

          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setStatus('error');
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <Container className="mt-5">
      {status === 'loading' && (
        <Card className="text-center">
          <Card.Body>
            <Spinner animation="border" /> Procesando pago...
          </Card.Body>
        </Card>
      )}
      {status === 'success' && (
        <Card className="text-center text-success">
          <Card.Body>
            <h2>¡Pago exitoso!</h2>
            <p>Tu sesión ha sido reservada correctamente.</p>
            <p>Recibirás un correo de confirmación en breve.</p>
          </Card.Body>
        </Card>
      )}
      {status === 'failed' && (
        <Card className="text-center text-danger">
          <Card.Body>
            <h2>Pago rechazado</h2>
            <p>Intenta nuevamente o contacta con tu banco.</p>
          </Card.Body>
        </Card>
      )}
      {status === 'error' && (
        <Card className="text-center text-danger">
          <Card.Body>
            <h2>Error en la transacción</h2>
            <p>Contacta con soporte.</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
