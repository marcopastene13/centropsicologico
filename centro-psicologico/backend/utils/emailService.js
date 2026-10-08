const { Resend } = require('resend');

let cachedClient = null;

const isEmailConfigured = () => !!process.env.RESEND_API_KEY;

const getClient = () => {
  if (!isEmailConfigured()) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new Resend(process.env.RESEND_API_KEY);
  return cachedClient;
};

const FROM = 'Centro Psicológico Centenario <contacto@centropsicologicocentenario.cl>';
const WHATSAPP_NUMBER = '56986431293';
const WHATSAPP_DISPLAY = '+56 9 8643 1293';
const COLOR = '#4a6fa5';
// Correo del centro: recibe copia de todas las solicitudes, asi nunca se pierde una
// aunque el correo de la profesional este mal cargado o sea un placeholder.
const CENTER_EMAIL = process.env.CENTER_EMAIL || 'cconsultapsicologica@gmail.com';
// Dominio de relleno que dejo el seed: no es real y los correos rebotan.
const esCorreoPlaceholder = (e) => /@centropsicologico\.cl$/i.test(String(e || '').trim());

// Los datos del paciente los escribe el propio paciente: hay que escaparlos
// antes de meterlos en el HTML (si no, un "<" en el motivo rompe el correo).
const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// "2026-10-12" -> "Lunes 12 de octubre de 2026"
const formatFecha = (fechaISO) => {
  const [y, m, d] = String(fechaISO).split('-').map(Number);
  if (!y || !m || !d) return String(fechaISO);
  const texto = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
  const limpio = texto.replace(',', '');
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

const waLink = (texto) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

// Layout con tablas: es lo unico que Gmail/Outlook renderizan de forma pareja.
const layout = ({ preheader, title, bodyHtml }) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f4f8;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f1f4f8;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f4f8;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e3e8ef;">
          <tr>
            <td style="background-color:${COLOR};padding:22px 24px;text-align:center;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:1px;color:#dbe6f5;text-transform:uppercase;">Centro Psicológico Centenario</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;margin-top:6px;">${esc(title)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#333333;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f7f9fc;padding:16px 24px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7a8699;border-top:1px solid #e3e8ef;">
              General Ordóñez 155, of. 1104, Maipú · ${WHATSAPP_DISPLAY}<br>
              centropsicologicocentenario.cl
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const detailsTable = (rows) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e3e8ef;border-radius:8px;margin:18px 0;">
    ${rows.filter(Boolean).map(([label, value], i, arr) => `
    <tr>
      <td valign="top" style="padding:11px 14px;width:36%;font-weight:bold;color:#2c4a6e;font-size:14px;background-color:#f7f9fc;${i < arr.length - 1 ? 'border-bottom:1px solid #e3e8ef;' : ''}">${esc(label)}</td>
      <td valign="top" style="padding:11px 14px;color:#333333;font-size:14px;${i < arr.length - 1 ? 'border-bottom:1px solid #e3e8ef;' : ''}">${value}</td>
    </tr>`).join('')}
  </table>`;

const button = (href, label, bg = '#25d366') => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px auto 0;">
    <tr>
      <td style="background-color:${bg};border-radius:8px;">
        <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">${esc(label)}</a>
      </td>
    </tr>
  </table>`;

const statusBadge = (texto) => `
  <p style="margin:0 0 4px;"><span style="display:inline-block;background-color:#fff4d6;color:#8a6100;border-radius:20px;padding:5px 14px;font-size:13px;font-weight:bold;">${esc(texto)}</span></p>`;

const send = async (client, payload, logLabel) => {
  const { data, error } = await client.emails.send({ from: FROM, ...payload });
  if (error) throw new Error(error.message || JSON.stringify(error));
  console.log(`[Email] ${logLabel}`);
  return { success: true, data };
};

// ---------- Correo al paciente ----------
const sendBookingEmailToPatient = async ({ nombrePaciente, emailPaciente, profesionalNombre, fecha, hora, servicio, modalidad }) => {
  const client = getClient();
  if (!client) {
    console.log('[Email] RESEND_API_KEY no configurada. Email simulado a', emailPaciente);
    return { success: false, simulated: true };
  }
  try {
    const fechaTxt = formatFecha(fecha);
    const consulta = waLink(
      `Hola, soy ${nombrePaciente}. Quiero consultar la disponibilidad de mi hora con ${profesionalNombre} el ${fechaTxt} a las ${hora} hrs.`
    );

    const html = layout({
      preheader: `Solicitud para el ${fechaTxt} a las ${hora} hrs. Falta confirmar disponibilidad y pago.`,
      title: 'Recibimos tu solicitud de hora',
      bodyHtml: `
        ${statusBadge('Pendiente de confirmación')}
        <p style="margin:14px 0 0;">Hola <strong>${esc(nombrePaciente)}</strong>,</p>
        <p style="margin:8px 0 0;">Recibimos tu solicitud de hora. <strong>Aún no está confirmada</strong>: primero revisamos la disponibilidad y la hora queda confirmada una vez realizado el pago.</p>
        ${detailsTable([
          ['Profesional', esc(profesionalNombre)],
          ['Sesión', esc(servicio || 'No especificada')],
          modalidad ? ['Modalidad', `Atención ${esc(modalidad.toLowerCase())}`] : null,
          ['Fecha', esc(fechaTxt)],
          ['Hora', `${esc(hora)} hrs`]
        ])}
        <p style="margin:0 0 6px;font-weight:bold;color:#2c4a6e;">Próximos pasos</p>
        <ol style="margin:0 0 20px;padding-left:20px;">
          <li style="margin-bottom:6px;">Escríbenos por WhatsApp para consultar la disponibilidad de la hora.</li>
          <li>Tu hora queda confirmada una vez realizado el pago.</li>
        </ol>
        ${button(consulta, 'Consultar disponibilidad por WhatsApp')}
        <p style="margin:22px 0 0;font-size:13px;color:#7a8699;text-align:center;">Si necesitas cambiar o cancelar tu solicitud, respóndenos por WhatsApp al ${WHATSAPP_DISPLAY}.</p>
      `
    });

    const text = [
      `Hola ${nombrePaciente},`,
      '',
      'Recibimos tu solicitud de hora. Aún NO está confirmada: primero revisamos la disponibilidad y la hora queda confirmada una vez realizado el pago.',
      '',
      `Profesional: ${profesionalNombre}`,
      `Sesión: ${servicio || 'No especificada'}`,
      modalidad ? `Modalidad: Atención ${modalidad.toLowerCase()}` : null,
      `Fecha: ${fechaTxt}`,
      `Hora: ${hora} hrs`,
      '',
      'Próximos pasos:',
      '1. Escríbenos por WhatsApp para consultar la disponibilidad de la hora.',
      '2. Tu hora queda confirmada una vez realizado el pago.',
      '',
      `WhatsApp: ${WHATSAPP_DISPLAY} (${consulta})`,
      '',
      'Centro Psicológico Centenario - General Ordóñez 155, of. 1104, Maipú'
    ].filter(l => l !== null).join('\n');

    return await send(client, {
      to: emailPaciente,
      subject: 'Recibimos tu solicitud de hora - Centro Psicológico Centenario',
      html,
      text
    }, `Solicitud enviada a paciente: ${emailPaciente}`);
  } catch (err) {
    console.error('[Email] Error enviando a paciente:', err.message);
    return { success: false, error: err.message };
  }
};

// ---------- Correo a la profesional ----------
const sendBookingEmailToProfessional = async ({ profesionalNombre, profesionalEmail, pacienteNombre, pacienteTelefono, pacienteEmail, fecha, hora, servicio, modalidad, motivo }) => {
  const client = getClient();
  const destinatarios = [...new Set(
    [profesionalEmail, CENTER_EMAIL]
      .map(e => String(e || '').trim().toLowerCase())
      .filter(e => e && !esCorreoPlaceholder(e))
  )];
  if (esCorreoPlaceholder(profesionalEmail)) {
    console.warn(`[Email] ${profesionalNombre} tiene un correo de relleno (${profesionalEmail}); se avisa solo al centro. Actualizalo en el panel.`);
  }
  if (!client || destinatarios.length === 0) {
    console.log('[Email] RESEND_API_KEY no configurada o sin destinatarios. Email simulado a', destinatarios.join(', '));
    return { success: false, simulated: true };
  }
  try {
    const fechaTxt = formatFecha(fecha);
    const soloDigitos = String(pacienteTelefono || '').replace(/\D/g, '');

    const html = layout({
      preheader: `${pacienteNombre} solicita hora el ${fechaTxt} a las ${hora} hrs (pendiente de pago).`,
      title: 'Nueva solicitud de hora',
      bodyHtml: `
        ${statusBadge('Pendiente de disponibilidad y pago')}
        <p style="margin:14px 0 0;">Hola <strong>${esc(profesionalNombre)}</strong>,</p>
        <p style="margin:8px 0 0;">Un paciente solicitó una hora contigo. Se confirma una vez realizado el pago; puedes gestionarla desde el panel de administración.</p>
        ${detailsTable([
          ['Paciente', esc(pacienteNombre)],
          ['Teléfono', soloDigitos
            ? `<a href="tel:+${esc(soloDigitos)}" style="color:${COLOR};">${esc(pacienteTelefono)}</a>`
            : esc(pacienteTelefono)],
          pacienteEmail ? ['Correo', `<a href="mailto:${esc(pacienteEmail)}" style="color:${COLOR};">${esc(pacienteEmail)}</a>`] : null,
          ['Sesión', esc(servicio || 'No especificada')],
          modalidad ? ['Modalidad', `Atención ${esc(modalidad.toLowerCase())}`] : null,
          ['Fecha', esc(fechaTxt)],
          ['Hora', `${esc(hora)} hrs`],
          motivo ? ['Motivo', esc(motivo)] : null
        ])}
      `
    });

    const text = [
      `Hola ${profesionalNombre},`,
      '',
      'Un paciente solicitó una hora contigo (pendiente de disponibilidad y pago).',
      '',
      `Paciente: ${pacienteNombre}`,
      `Teléfono: ${pacienteTelefono}`,
      pacienteEmail ? `Correo: ${pacienteEmail}` : null,
      `Sesión: ${servicio || 'No especificada'}`,
      modalidad ? `Modalidad: Atención ${modalidad.toLowerCase()}` : null,
      `Fecha: ${fechaTxt}`,
      `Hora: ${hora} hrs`,
      motivo ? `Motivo: ${motivo}` : null
    ].filter(l => l !== null).join('\n');

    return await send(client, {
      to: destinatarios,
      reply_to: pacienteEmail || undefined,
      subject: `Nueva solicitud: ${String(pacienteNombre).replace(/[\r\n]+/g, ' ').slice(0, 60)} - ${fechaTxt} ${hora} hrs`,
      html,
      text
    }, `Aviso enviado a: ${destinatarios.join(', ')}`);
  } catch (err) {
    console.error('[Email] Error enviando a profesional:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { isEmailConfigured, sendBookingEmailToPatient, sendBookingEmailToProfessional };
