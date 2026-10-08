// Datos de contacto del centro, en un solo lugar.
export const WHATSAPP_NUMBER = '56986431293';

export const whatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// "2026-10-12" -> "Lunes 12 de octubre de 2026"
export const formatFechaLarga = (fechaISO) => {
  if (!fechaISO) return '';
  const [y, m, d] = fechaISO.split('-').map(Number);
  const texto = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
  const limpio = texto.replace(',', '');
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

// Mensaje que le llega al centro cuando el paciente solicita una hora.
export const mensajeConsultaHora = ({ nombre, profesional, sesion, modalidad, fecha, hora, reservaId }) =>
  [
    `Hola, soy ${nombre}. Quiero consultar la disponibilidad de esta hora:`,
    '',
    `Profesional: ${profesional}`,
    `Sesión: ${sesion}`,
    modalidad ? `Modalidad: Atención ${modalidad}` : null,
    `Fecha: ${formatFechaLarga(fecha)}`,
    `Hora: ${hora} hrs`,
    reservaId ? `N° de solicitud: ${reservaId}` : null,
    '',
    '¿Está disponible? Entiendo que la hora queda confirmada una vez realizado el pago.'
  ].filter(l => l !== null).join('\n');

// "2026-10-12" de hoy en Chile (no en UTC), para no desfasar el día por la noche.
export const hoyChile = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());
