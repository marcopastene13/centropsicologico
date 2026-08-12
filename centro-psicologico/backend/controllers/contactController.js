const { Resend } = require('resend');

const CENTRO_EMAIL = process.env.CENTRO_EMAIL || 'cconsultapsicologica@gmail.com';
const FROM = 'Centro Psicológico Centenario <contacto@centropsicologicocentenario.cl>';

const sendContact = async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validaciones
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Correo electronico invalido' });
    }

    const telRegex = /^[+]?[\d\s()-]{7,15}$/;
    if (!telRegex.test(telefono)) {
      return res.status(400).json({ message: 'Telefono invalido' });
    }

    console.log(`[CONTACTO] ${nombre} | ${email} | ${telefono}`);

    // Enviar correos si hay config de email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // --- Email 1: Notificacion al centro ---
      await resend.emails.send({
        from: FROM,
        to: CENTRO_EMAIL,
        subject: `Nuevo mensaje de contacto - ${nombre}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4a6fa5; padding: 20px; text-align: center;">
              <h2 style="color: white; margin: 0;">Nuevo mensaje de contacto</h2>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p style="color: #555;">Has recibido un nuevo mensaje desde el formulario de contacto del sitio web.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px; font-weight: bold; color: #333; width: 140px;">Nombre:</td>
                  <td style="padding: 10px; color: #555;">${nombre}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; background-color: #fff;">
                  <td style="padding: 10px; font-weight: bold; color: #333;">Email:</td>
                  <td style="padding: 10px; color: #555;"><a href="mailto:${email}" style="color: #4a6fa5;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px; font-weight: bold; color: #333;">Telefono:</td>
                  <td style="padding: 10px; color: #555;">${telefono}</td>
                </tr>
                <tr style="background-color: #fff;">
                  <td style="padding: 10px; font-weight: bold; color: #333; vertical-align: top;">Mensaje:</td>
                  <td style="padding: 10px; color: #555;">${mensaje}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background-color: #e8f0fe; border-radius: 6px;">
                <p style="margin: 0; color: #4a6fa5; font-size: 13px;">Puedes responder directamente a este correo o contactar al paciente en: <strong>${email}</strong></p>
              </div>
            </div>
            <div style="background-color: #4a6fa5; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">Centro Psicologico Centenario &mdash; centropsicologicocentenario.cl</p>
            </div>
          </div>
        `
      });

      // --- Email 2: Confirmacion al cliente ---
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Hemos recibido tu mensaje - Centro Psicologico Centenario',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4a6fa5; padding: 20px; text-align: center;">
              <h2 style="color: white; margin: 0;">Gracias por contactarnos</h2>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p style="color: #333; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
              <p style="color: #555;">Hemos recibido tu mensaje correctamente. Nuestro equipo se pondra en contacto contigo a la brevedad posible.</p>
              <div style="margin: 25px 0; padding: 20px; background-color: #fff; border-left: 4px solid #4a6fa5; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Resumen de tu mensaje:</p>
                <p style="margin: 0; color: #555; font-style: italic;">&ldquo;${mensaje}&rdquo;</p>
              </div>
              <p style="color: #555;">Si tienes alguna consulta urgente, puedes contactarnos directamente:</p>
              <ul style="color: #555; padding-left: 20px;">
                <li>Telefono: +56 9 1234 5678</li>
                <li>Email: <a href="mailto:cconsultapsicologica@gmail.com" style="color: #4a6fa5;">cconsultapsicologica@gmail.com</a></li>
                <li>Horario: Lunes a Viernes, 9:00 - 18:00 hrs</li>
              </ul>
            </div>
            <div style="background-color: #4a6fa5; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">Centro Psicologico Centenario &mdash; centropsicologicocentenario.cl</p>
            </div>
          </div>
        `
      });

      console.log(`[CONTACTO] Emails enviados a ${CENTRO_EMAIL} y ${email}`);
    } else {
      console.warn('[CONTACTO] RESEND_API_KEY no configurada. No se enviaron correos.');
    }

    res.json({ message: 'Mensaje enviado exitosamente. Nos contactaremos a la brevedad.' });
  } catch (err) {
    console.error('Error sendContact:', err);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};

module.exports = { sendContact };
