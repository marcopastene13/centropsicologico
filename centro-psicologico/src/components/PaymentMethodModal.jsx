import React, { useState } from 'react';
import { Modal, Button, Form, Nav, Alert, Spinner } from 'react-bootstrap';
import {
  notifyProfessionalPayment,
  notifyClientPayment,
  generateTransactionId,
  saveTransactionRecord
} from "../utils/notificationService";
import { getPaymentMethods } from '../data/paymentMethods';

const PaymentMethodModal = ({
  show,
  onHide,
  professional,
  bookingData,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState('mercadolibre');
  const [clientEmail, setClientEmail] = useState(bookingData?.email || '');
  const [clientName, setClientName] = useState(bookingData?.name || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePaymentMercadoLibre = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');
      const transactionId = generateTransactionId();
      const amount = bookingData?.amount || 0;
      const paymentMethods = getPaymentMethods(professional?.id);
      const mercadoLibreLink = paymentMethods?.mercadolibre?.url;

      if (!mercadoLibreLink) {
        setErrorMessage('No se pudo generar el enlace de pago de Mercado Libre');
        return;
      }

      sessionStorage.setItem('pendingTransaction', JSON.stringify({
        transactionId,
        professionalId: professional?.id,
        clientEmail,
        clientName,
        amount,
        paymentMethod: 'mercadolibre',
        bookingDetails: bookingData,
        timestamp: new Date().toISOString()
      }));

      window.location.href = mercadoLibreLink;
    } catch (error) {
      console.error('Error processing Mercado Libre payment:', error);
      setErrorMessage('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentTransfer = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');
      const transactionId = generateTransactionId();
      const paymentMethods = getPaymentMethods(professional?.id);
      const bankDetails = paymentMethods?.transfer?.details;

      if (!bankDetails) {
        setErrorMessage('No se encontraron los datos bancarios del profesional');
        return;
      }

      const transactionData = {
        transactionId,
        professionalId: professional?.id,
        clientEmail,
        clientName,
        amount: bookingData?.amount,
        paymentMethod: 'transfer',
        bookingDetails: bookingData,
        timestamp: new Date().toISOString()
      };

      await saveTransactionRecord(transactionData);

      await Promise.all([
        notifyProfessionalPayment(
          {
            ...bookingData,
            clientName,
            date: bookingData?.date,
            time: bookingData?.time
          },
          transactionId,
          professional
        ),
        notifyClientPayment(
          {
            email: clientEmail,
            ...bookingData,
            professionalName: professional?.name
          },
          transactionId
        )
      ]);

      const bankInfoModal = `DATOS BANCARIOS: Banco: ${bankDetails.bank}, Cuenta: ${bankDetails.accountNumber}, Referencia: ${transactionId}, Monto: ${bookingData?.amount}`;
      alert(bankInfoModal);

      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess({
            transactionId,
            status: 'pending_verification',
            paymentMethod: 'transfer'
          });
        }
        onHide();
      }, 2000);
    } catch (error) {
      console.error('Error processing transfer payment:', error);
      setErrorMessage('Error al procesar la transferencia. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentInfo = getPaymentMethods(professional?.id);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Metodo de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tu nombre"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isProcessing}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Correo Electronico</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={isProcessing}
            />
          </Form.Group>
        </Form>
        <Nav variant="pills" className="flex-column">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'mercadolibre'}
              onClick={() => setActiveTab('mercadolibre')}
              className="text-start"
            >
              Mercado Libre
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'transfer'}
              onClick={() => setActiveTab('transfer')}
              className="text-start"
            >
              Transferencia Bancaria
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="mt-4 p-3 bg-light rounded">
          {activeTab === 'mercadolibre' && (
            <div>
              <h6 className="mb-3">Mercado Libre</h6>
              <p className="text-muted mb-3">Paga de manera segura a traves de Mercado Libre</p>
              <p className="mb-0"><strong>Monto a pagar:</strong> ${bookingData?.amount}</p>
            </div>
          )}
          {activeTab === 'transfer' && (
            <div>
              <h6 className="mb-3">Transferencia Bancaria</h6>
              <p className="text-muted mb-3">Realiza una transferencia bancaria al profesional</p>
              <p className="mb-0"><strong>Monto a transferir:</strong> ${bookingData?.amount}</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={activeTab === 'mercadolibre' ? handlePaymentMercadoLibre : handlePaymentTransfer}
          disabled={isProcessing || !clientEmail || !clientName}
        >
          {isProcessing && <Spinner animation="border" size="sm" className="me-2" />}
          {activeTab === 'mercadolibre' ? 'Pagar con Mercado Libre' : 'Confirmar Transferencia'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentMethodModal;
