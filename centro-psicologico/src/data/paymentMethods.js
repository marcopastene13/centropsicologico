/**
 * Métodos de pago personalizados para cada profesional
 * Mercado Libre + Transferencia Bancaria
 */

export const paymentMethods = {
  // Patricia Santander
  1: {
    mercadoLibre: {
      enabled: true,
      email: "patricia@centropsi.cl",
      // En producción, usar MercadoPago API
      preferenceId: "MP_PREF_PATRICIA_001"
    },
    transfer: {
      enabled: true,
      bankName: "Banco Falabella",
      accountHolder: "Patricia Santander González",
      accountNumber: "3421984729",
      bankCode: "010",
      accountType: "Cuenta Corriente",
      rut: "15.234.567-8"
    },
    whatsapp: "+56932736893",
    email: "patricia@centropsi.cl"
  },
  // Yasna Valdes
  2: {
    mercadoLibre: {
      enabled: true,
      email: "yasna@centropsi.cl",
      preferenceId: "MP_PREF_YASNA_001"
    },
    transfer: {
      enabled: true,
      bankName: "BancoEstado",
      accountHolder: "Yasna Valdes Pérez",
      accountNumber: "2198374512",
      bankCode: "012",
      accountType: "Cuenta Corriente",
      rut: "18.456.789-2"
    },
    whatsapp: "+56987654321",
    email: "yasna@centropsi.cl"
  },
  // Stephany Troncoso
  3: {
    mercadoLibre: {
      enabled: true,
      email: "stephany@centropsi.cl",
      preferenceId: "MP_PREF_STEPHANY_001"
    },
    transfer: {
      enabled: true,
      bankName: "Itau",
      accountHolder: "Stephany Troncoso López",
      accountNumber: "5671234098",
      bankCode: "039",
      accountType: "Cuenta Corriente",
      rut: "19.567.890-3"
    },
    whatsapp: "+56987654321",
    email: "stephany@centropsi.cl"
  }
};

/**
 * Obtener métodos de pago de un profesional
 */
export const getPaymentMethods = (professionalId) => {
  return paymentMethods[professionalId] || null;
};

export default paymentMethods;