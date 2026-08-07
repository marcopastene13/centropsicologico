/**
 * Servicio de notificaciones
 * Maneja generacion de IDs de transaccion y guardado de registros
 */

/**
 * Generar ID de transacion unico
 */
export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `TXN${timestamp}${random}`.toUpperCase();
};

/**
 * Guardar registro de transacion (mock - en prod se conectaria a backend)
 */
export const saveTransactionRecord = async (transactionData) => {
  try {
    // Mock: En produccion, esto llamaria a tu API backend
    console.log('Guardando transaccion:', transactionData);
    
    // Simular envio a backend
    const mockResponse = {
      success: true,
      transactionId: transactionData.transactionId,
      timestamp: new Date().toISOString()
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

/**
 * Notificar al profesional (mock - en prod se usaria SendGrid o Twilio)
 */
export const notifyProfessionalPayment = async (booking, transactionId, professional) => {
  try {
    // Mock: En produccion, esto usaria SendGrid para email y Twilio para WhatsApp
    console.log('Notificando al profesional:', {
      name: professional.name,
      email: professional.email,
      whatsapp: professional.whatsapp,
      transactionId,
      booking
    });
    
    return { success: true, transactionId };
  } catch (error) {
    console.error('Error notifying professional:', error);
    throw error;
  }
};

/**
 * Notificar al cliente (mock)
 */
export const notifyClientPayment = async (booking, transactionId) => {
  try {
    // Mock: En produccion, esto usaria SendGrid para enviar email
    console.log('Notificando al cliente:', {
      email: booking.email,
      transactionId,
      professionalName: booking.professionalName,
      date: booking.date,
      time: booking.time
    });
    
    return { success: true, transactionId };
  } catch (error) {
    console.error('Error notifying client:', error);
    throw error;
  }
};

export default {
  notifyProfessionalPayment,
  notifyClientPayment,
  generateTransactionId,
  saveTransactionRecord
};