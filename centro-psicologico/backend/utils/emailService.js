const nodemailer = require('nodemailer');

let cachedTransporter = null;

const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    family: 4,
    connectionTimeout: 15000
  });
  return cachedTransporter;
};

const wrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #4a6fa5; padding: 20px; text-align: center;">
      <h2 style="color: white; margin: 0;">${title}</h2>
    </div>
    <div style="padding: 30px; background-color: #f9f9f9;">
      ${bodyHtml}
    </div>
    <div style="background-color: #4a6fa5; padding: 15px; text-align: center;">
      <p style="color: white; margin: 0; font-size: 12px;">Centro Psicológico Centenario &mdash; centropsicologicocentenario.cl</p>
    </div>
  </div>
`;

const detailRow = (label, value) => `
  <tr style="border-bottom: 1px solid #eee;">
    <td style="padding: 10px; font-weight: bold; color: #333; width: 140px;">${label}:</td>
    <td style="padding: 10px; color: #555;">${value}</td>
  </tr>
`;

const sendBookingEmailToPatient = async ({ nombrePaciente, emailPaciente, profesionalNombre, fecha, hora, servicio }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[Email] EMAIL_USER/EMAIL_PASS no configurados. Email simulado a', emailPaciente);
    return { success: false, simulated: true };
  }
  try {
    const html = wrapper('Reserva Confirmada', `
      <p style="color: #333; font-size: 16px;">Hola <strong>${nombrePaciente}</strong>,</p>
      <p style="color: #555;">Tu hora en Centro Psicológico Centenario ha sido confirmada.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        ${detailRow('Profesional', profesionalNombre)}
        ${detailRow('Sesión', servicio || 'No especificado')}
        ${detailRow('Fecha', fecha)}
        ${detailRow('Hora', hora)}
      </table>
      <p style="color: #555; margin-top: 20px;">Si necesitas reagendar o cancelar, contáctanos con anticipación.</p>
    `);
    const info = await transporter.sendMail({
      from: `"Centro Psicológico Centenario" <${process.env.EMAIL_USER}>`,
      to: emailPaciente,
      subject: 'Reserva Confirmada - Centro Psicológico Centenario',
      html
    });
    console.log('[Email] Confirmacion enviada a paciente:', emailPaciente);
    return { success: true, info };
  } catch (err) {
    console.error('[Email] Error enviando a paciente:', err.message);
    return { success: false, error: err.message };
  }
};

const sendBookingEmailToProfessional = async ({ profesionalNombre, profesionalEmail, pacienteNombre, pacienteTelefono, fecha, hora, servicio, motivo }) => {
  const transporter = getTransporter();
  if (!transporter || !profesionalEmail) {
    if (!profesionalEmail) console.log('[Email] Profesional sin email registrado, no se notifica.');
    else console.log('[Email] EMAIL_USER/EMAIL_PASS no configurados. Email simulado a', profesionalEmail);
    return { success: false, simulated: true };
  }
  try {
    const html = wrapper('Nueva Reserva', `
      <p style="color: #333; font-size: 16px;">Hola <strong>${profesionalNombre}</strong>,</p>
      <p style="color: #555;">Tienes una nueva reserva agendada.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        ${detailRow('Paciente', pacienteNombre)}
        ${detailRow('Teléfono', pacienteTelefono)}
        ${detailRow('Sesión', servicio || 'No especificado')}
        ${detailRow('Fecha', fecha)}
        ${detailRow('Hora', hora)}
        ${motivo ? detailRow('Motivo', motivo) : ''}
      </table>
    `);
    const info = await transporter.sendMail({
      from: `"Centro Psicológico Centenario" <${process.env.EMAIL_USER}>`,
      to: profesionalEmail,
      subject: `Nueva reserva: ${pacienteNombre} - ${fecha} ${hora}`,
      html
    });
    console.log('[Email] Notificacion enviada a profesional:', profesionalEmail);
    return { success: true, info };
  } catch (err) {
    console.error('[Email] Error enviando a profesional:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { isEmailConfigured, sendBookingEmailToPatient, sendBookingEmailToProfessional };
