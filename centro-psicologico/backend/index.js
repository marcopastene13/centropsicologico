require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenAI } = require('@google/genai');
const twilio = require('twilio');
const WebpayPlus = require('transbank-sdk').WebpayPlus;
const Options = require('transbank-sdk').Options;
const Environment = require('transbank-sdk').Environment;
const IntegrationCommerceCodes = require('transbank-sdk').IntegrationCommerceCodes;
const IntegrationApiKeys = require('transbank-sdk').IntegrationApiKeys;

// ============= INICIALIZAR EXPRESS (UNA SOLA VEZ) =============
const app = express();

// ============= MIDDLEWARE =============
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ============= CONFIGURACIONES =============

// Transbank Webpay
const tx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
);

// Twilio WhatsApp
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Google Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ============= FUNCIÓN ENVIAR EMAIL =============

const sendConfirmationEmail = async (email, formData, professional, selectedDate, selectedSlot, buyOrder, amount) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          h2 { color: #28a745; margin-top: 0; }
          h3 { color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px; }
          .detail { margin: 12px 0; padding: 8px; background-color: #f9f9f9; border-left: 3px solid #28a745; }
          .label { font-weight: bold; color: #333; display: inline-block; width: 120px; }
          .value { color: #555; }
          .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px; }
          .contact { background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .contact p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>✓ ¡Sesión Reservada Correctamente!</h2>
          <p>Hola <strong>${formData.nombre}</strong>,</p>
          <p>Tu reserva ha sido confirmada y el pago ha sido procesado exitosamente. Recibirás pronto el contacto del equipo.</p>
          
          <h3>📋 Detalles de tu sesión:</h3>
          <div class="detail">
            <span class="label">Profesional:</span>
            <span class="value">${professional.name}</span>
          </div>
          <div class="detail">
            <span class="label">Fecha:</span>
            <span class="value">${new Date(selectedDate).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="detail">
            <span class="label">Hora:</span>
            <span class="value">${selectedSlot}</span>
          </div>
          <div class="detail">
            <span class="label">Monto pagado:</span>
            <span class="value">$${amount.toLocaleString('es-CL')}</span>
          </div>
          <div class="detail">
            <span class="label">Orden de Compra:</span>
            <span class="value">${buyOrder}</span>
          </div>
          
          <h3>👤 Tus datos:</h3>
          <div class="detail">
            <span class="label">Nombre:</span>
            <span class="value">${formData.nombre}</span>
          </div>
          <div class="detail">
            <span class="label">RUT:</span>
            <span class="value">${formData.rut}</span>
          </div>
          <div class="detail">
            <span class="label">Correo:</span>
            <span class="value">${formData.correo}</span>
          </div>
          <div class="detail">
            <span class="label">Teléfono:</span>
            <span class="value">${formData.telefono}</span>
          </div>

          <h3>📝 Tu situación:</h3>
          <div class="detail">
            <span class="value">${formData.detalles}</span>
          </div>

          <div class="contact">
            <h3 style="margin-top: 0; border: none; color: #1b5e20;">📞 Próximos pasos</h3>
            <p>Pronto recibirás un contacto de <strong>${professional.name}</strong> o del equipo del Centro Psicológico Centenario para confirmar los detalles finales de tu sesión.</p>
            <p>Si tienes dudas, contáctanos por:</p>
            <p><strong>WhatsApp:</strong> +56 9 32736893</p>
            <p><strong>Correo:</strong> cconsultapsicologica@gmail.com</p>
          </div>

          <div class="footer">
            <p><strong>Centro Psicológico Centenario</strong></p>
            <p>General Ordoñez 155 oficina 1104, Maipú, Región Metropolitana</p>
            <p>© 2025 Centro Psicológico Centenario. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: '✅ Confirmación de Reserva - Centro Psicológico Centenario',
      html: htmlContent,
    });
    console.log(`📧 Email enviado exitosamente a ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return false;
  }
};

// ============= ENDPOINTS TRANSBANK + EMAIL =============

app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, buyOrder, sessionId, returnUrl } = req.body;

    if (!amount || !buyOrder || !sessionId || !returnUrl) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json({
      token: response.token,
      url: response.url,
    });
  } catch (error) {
    console.error('❌ Error creating Webpay transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

app.post('/api/payment/commit', async (req, res) => {
  try {
    const { token, formData, professional, selectedDate, selectedSlot, buyOrder, amount } = req.body;

    if (!token || !formData || !professional) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const response = await tx.commit(token);

    if (response.response_code === 0) {
      // Pago exitoso, enviar email
      const emailSent = await sendConfirmationEmail(
        formData.correo,
        formData,
        professional,
        selectedDate,
        selectedSlot,
        buyOrder,
        amount
      );

      res.json({
        success: true,
        message: 'Pago confirmado y email enviado',
        emailSent,
        data: response,
      });
    } else {
      res.json({
        success: false,
        message: 'Pago rechazado',
        responseCode: response.response_code,
        data: response,
      });
    }
  } catch (error) {
    console.error('❌ Error committing Webpay transaction:', error);
    res.status(500).json({ error: 'Error committing transaction' });
  }
});

// ============= WHATSAPP BOT CON GEMINI IA =============

app.post('/webhook', async (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase();
  const from = req.body.From;

  let respuesta = "";

  // Reglas simples personalizadas
  if (incomingMsg.includes("ubicación") || incomingMsg.includes("donde estan ubicados") || incomingMsg.includes("ubicacion")) {
    respuesta = "Estamos en Maipú, Región Metropolitana. General Ordoñez 155 oficina 1104, cerca de Plaza Maipú.";
  } else if (incomingMsg.includes("horario")) {
    respuesta = "Atendemos de lunes a viernes de 9:00 a 19:00 hrs.";
  } else {
    // Gemini IA responde
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [
          `Eres el asistente virtual de "Centro Psicológico Centenario", ubicado en General Ordoñez 155 oficina 1104, Maipú, Región Metropolitana, cerca de Plaza Maipú. Tu misión:
- Ayudar a nuevos y actuales pacientes respondiendo dudas, agendar citas, informar sobre profesionales y servicios.
- Siempre responde de forma cálida, profesional, breve y ética.

INFORMACIÓN CLAVE:
- Equipo multidisciplinario: psicólogos y psicopedagogos.
- Profesionales destacados:
  - Patricia Santander: Especialista en terapia de adultos y manejo de ansiedad.
  - Yasna Valdes: Psicólogo infantil, adolescente y terapia familiar.
  - Stephany Troncoso: Terapia de pareja, psicología organizacional.
- Especialidades: terapia individual, pareja, familiar, infantil, adolescente y psicopedagogía.
- Atención totalmente personalizada y profesional para bienestar emocional.
- Espacio seguro, ético y respetuoso, enfocado en cambios positivos y acompañamiento.
- Horario: lunes a viernes de 9:00 a 19:00 hrs.
- Teléfono de contacto: +56 9 32736893 | Email: cconsultapsicologica@gmail.com
- Puedes agendar por WhatsApp, indicando tu nombre, día, hora y motivo de consulta.
- Consulta por precios y servicios específicos según la especialidad requerida.
- Los valores de la consulta son desde los $20.000 hasta los $50.000
- El centro comparte artículos recientes y recursos de salud mental.

Si no puedes responder una consulta clínica específica, informa: "¿Quieres derivar tu caso a un profesional del equipo? Puedes agendar directamente y te orientamos".

Promueve equilibrio, bienestar y el derecho a recibir apoyo psicológico sin juicios.`,
          incomingMsg
        ],
      });

      respuesta = response.text;
    } catch (err) {
      console.error("❌ Error Gemini:", err);
      respuesta = "Hubo un error con el agente. Intenta más tarde o contacta directamente: +56 9 32736893";
    }
  }

  // Enviar respuesta por WhatsApp
  await client.messages.create({
    body: respuesta,
    from: process.env.TWILIO_NUMBER,
    to: from
  });

  res.send('<Response></Response>');
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcional ✓' });
});

// ============= INICIAR SERVIDOR (UNA SOLA VEZ) =============

app.listen(3000, () => {
  console.log('🚀 Backend escuchando en puerto 3000');
  console.log('✅ Transbank Webpay + Email configurado');
  console.log('✅ WhatsApp Bot con Gemini IA configurado');
  console.log('📧 Email:', process.env.EMAIL_USER);
});
