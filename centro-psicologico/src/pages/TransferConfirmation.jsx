import { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

export default function TransferConfirmation() {
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    const data = {
      amount: sessionStorage.getItem('amount'),
      buyOrder: sessionStorage.getItem('buyOrder'),
      formData: JSON.parse(sessionStorage.getItem('formData') || '{}'),
      professional: JSON.parse(sessionStorage.getItem('professional') || '{}'),
      selectedDate: sessionStorage.getItem('selectedDate'),
      selectedSlot: sessionStorage.getItem('selectedSlot'),
    };
    setReservationData(data);
  }, []);

  if (!reservationData) {
    return <div>Cargando...</div>;
  }

  return (
    <Container className="mt-5">
      <Card className="custom-card">
        <Card.Body>
          <h2 className="text-center mb-4">💳 Instrucciones de Transferencia Electrónica</h2>

          <Alert variant="info">
            Tu reserva ha sido creada. Por favor, realiza una transferencia electrónica con los datos que aparecen a continuación.
          </Alert>

          <h4 className="mt-4">📋 Detalles de tu Sesión:</h4>
          <div className="mb-3 p-3 bg-light rounded">
            <p><strong>Profesional:</strong> {reservationData.professional.name}</p>
            <p><strong>Fecha:</strong> {new Date(reservationData.selectedDate).toLocaleDateString('es-CL')}</p>
            <p><strong>Hora:</strong> {reservationData.selectedSlot}</p>
            <p><strong>Monto a pagar:</strong> <strong className="text-danger">${parseInt(reservationData.amount).toLocaleString('es-CL')}</strong></p>
          </div>

          <h4 className="mt-4">🏦 Datos para la Transferencia:</h4>
          <div className="mb-3 p-3 bg-warning bg-opacity-10 rounded border border-warning">
            <p><strong>Banco:</strong> Banco del Desarrollo (Banco State)</p>
            <p><strong>Tipo de Cuenta:</strong> Cuenta Corriente</p>
            <p><strong>Número de Cuenta:</strong> <code>01234567890</code></p>
            <p><strong>RUT:</strong> <code>76.123.456-7</code></p>
            <p><strong>Titular:</strong> Centro Psicológico Centenario</p>
            <p><strong>Código de Referencia:</strong> <code>{reservationData.buyOrder}</code></p>
          </div>

          <Alert variant="warning" className="mt-3">
            ⚠️ <strong>IMPORTANTE:</strong> En el concepto o descripción de la transferencia, ingresa el código de referencia: <strong>{reservationData.buyOrder}</strong>
          </Alert>

          <h4 className="mt-4">📝 Datos de la Reserva:</h4>
          <div className="mb-3 p-3 bg-light rounded">
            <p><strong>Nombre:</strong> {reservationData.formData.nombre}</p>
            <p><strong>Correo:</strong> {reservationData.formData.correo}</p>
            <p><strong>Teléfono:</strong> {reservationData.formData.telefono}</p>
          </div>

          <Alert variant="success" className="mt-4">
            ✅ <strong>Próximos pasos:</strong>
            <ul className="mt-2 mb-0">
              <li>Realiza la transferencia con los datos indicados arriba</li>
              <li>Incluye el código de referencia en la transferencia</li>
              <li>Una vez confirmada la transferencia, recibirás un correo de confirmación</li>
              <li>Si tienes dudas, contacta por WhatsApp: +56 9 32736893</li>
            </ul>
          </Alert>

          <div className="mt-4 d-flex gap-2">
            <Button
              href="https://wa.me/56932736893?text=Ya%20realic%C3%A9%20la%20transferencia%20electr%C3%B3nica"
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
              className="flex-grow-1"
            >
              Confirmar transferencia por WhatsApp
            </Button>
            <Button
              href="/profesionales"
              variant="outline-primary"
              className="flex-grow-1"
            >
              Volver
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
