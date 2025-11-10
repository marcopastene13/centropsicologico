const WebpayPlus = require('transbank-sdk').WebpayPlus;
const Options = require('transbank-sdk').Options;
const Environment = require('transbank-sdk').Environment;
const IntegrationCommerceCodes = require('transbank-sdk').IntegrationCommerceCodes;
const IntegrationApiKeys = require('transbank-sdk').IntegrationApiKeys;

// Configurar Webpay (usa IntegrationCommerceCodes y IntegrationApiKeys para PRUEBAS)
const tx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
);

// Endpoint para crear transacción
app.post('/api/payment/create', async (req, res) => {
  const { amount, buyOrder, sessionId, returnUrl } = req.body;

  try {
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json({
      token: response.token,
      url: response.url,
    });
  } catch (error) {
    console.error('Error creating Webpay transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

// Endpoint para confirmar la transacción
app.post('/api/payment/commit', async (req, res) => {
  const { token } = req.body;

  try {
    const response = await tx.commit(token);
    res.json(response);
  } catch (error) {
    console.error('Error committing Webpay transaction:', error);
    res.status(500).json({ error: 'Error committing transaction' });
  }
});


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenAI } = require('@google/genai');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/webhook', async (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase();
  const from = req.body.From;

  let respuesta = "";

  if (incomingMsg.includes("ubicación") || incomingMsg.includes("donde estan ubicados")) {
    respuesta = "Estamos en Maipú, Región Metropolitana, cerca de Plaza Maipú.";
  } else if (incomingMsg.includes("horario")) {
    respuesta = "Atendemos de lunes a viernes de 9:00 a 19:00 hrs.";
  } else {
    try {
      const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite", // o el modelo que tengas disponible
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
- El centro comparte artículos recientes y recursos de salud mental.
- Los valores de la consulta son desde los $20.000 hasta los $50.000

Si no puedes responder una consulta clínica específica, informa: “¿Quieres derivar tu caso a un profesional del equipo? Puedes agendar directamente y te orientamos”.

Promueve equilibrio, bienestar y el derecho a recibir apoyo psicológico sin juicios.
`,
    incomingMsg
  ],
});

      respuesta = response.text;
    } catch (err) {
      console.error("Error Gemini:", err);
      respuesta = "Hubo un error con el agente Gemini. Intenta más tarde.";
    }
  }

  await client.messages.create({
    body: respuesta,
    from: process.env.TWILIO_NUMBER,
    to: from
  });

  res.send('<Response></Response>');
});

app.listen(3000, () => {
  console.log("Bot WhatsApp con Gemini (nuevo SDK) escuchando en puerto 3000");
});
