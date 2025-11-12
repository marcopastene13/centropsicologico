require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { GoogleGenAI } = require('@google/genai');
const twilio = require('twilio');
const WebpayPlus = require('transbank-sdk').WebpayPlus;
const Options = require('transbank-sdk').Options;
const Environment = require('transbank-sdk').Environment;

const app = express();
const SECRET_KEY = "123456";

// ===== MIDDLEWARE / DEBUG UNIVERSAL =====
app.use((req, res, next) => {
  console.log(`=== ${req.method} ${req.url} ===`);
  next();
});

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});
app.use(express.json()); // Este es mejor que bodyParser para JSON moderno
app.use(express.urlencoded({ extended: false }));


// ======== CONFIGS & INTEGRACIONES ========
const tx = new WebpayPlus.Transaction(
  new Options(
    process.env.TRANSBANK_COMMERCE_CODE,
    process.env.TRANSBANK_API_KEY,
    Environment.Integration
  )
);

console.log({
  commerceCode: process.env.TRANSBANK_COMMERCE_CODE,
  apiKey: process.env.TRANSBANK_API_KEY
});


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ======== ARRAY PROFESIONALES (COPIA DIRECTA) ========
let profesionales = [
  {
    id: 1,
    name: "Patricia Santander",
    title: "Psicóloga Clínica",
    img: "/images/patty.jpg",
    whatsapp: "56986431293",
    bio: "Patricia Santander, Directora y Psicóloga Clínica desde 2016 en Maipú, especialista en psicodiagnóstico, terapia individual y víctimas de ASI. También ejerce como Perito Judicial Forense, elaborando informes y evaluaciones en contextos penales y familiares.",
    specialties: ["Psicodiagnóstico avanzado", "Depresión", "Peritaje judicial forense", "Evaluación en contextos penales y familiares"],
    education: [
      "Diplomado en Peritaje Psicológico y Social en Contexto Judicial | Universidad Andrés Bello (UNAB) | 2023",
      "Diplomado Internacional Estrategias Clínicas Terapia Breve | ADIPA | 2021",
      "Curso Peritaje Psicológico en contexto familiar  | Instituto Virtulys | 2021",
      "Curso Psicopatología Forense: Herramientas para la Evaluación Pericial Psicológica | Instituto Grupo Palermo | 2018",
      "Título Profesional de Psicóloga con Grado Académico de Licenciada en Psicología | Universidad de Las Américas(UDLA) | 2015",
      "Seminario “Psicología Forense y Jurídica” | Universidad Bernardo O'Higgins (UBO) | 2015",
      "Seminario “Expresiones de la Violencia de Género” | Universidad de Concepción (UDC) | 2015",
      "Seminario “Autocuidado y Manejo de las Emociones en Niños Preadolescentes” | Universidad de Las Américas(UDLA) | 2013",
      "Seminario “Apego en la Primera Infancia” | Universidad de Chile (UDCH) | 2012",
      "Cátedra Grafología | Universidad de Las Américas (UDLA) | 2012"
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5],
    slots: { start: "09:00", end: "20:00", intervalMins: 60 },
    exceptions: {},
    booked: {},
    modalities: ["presencial", "online"],
  },
  {
    id: 2,
    name: "Yasna Valdes",
    title: "Psicólogo Infantil",
    img: "/images/yasna.jpg",
    whatsapp: "56987654321",
    bio: "Psicóloga clínica egresada con distinción máxima con más de 10 años de experiencia. Especialista en tratamiento de procesos de reparación en vulneración de derechos, abordaje de trastornos del ánimo y conducta. Experta en psicodiagnóstico y trabajo en equipos multidisciplinarios.",
    specialties: ["Psicología Infantil", "TDAH", "Trastornos del Espectro Autista", "Terapia Familiar"],
    education: [
      "Psicóloga clínica",
      "Diplomada en Salud Mental",
      "Diplomada en Pruebas Psicológicas y Proyectivas",
      "Post-título en Infancia, Adolescencia y Familia",
      "Diplomada en Derechos Humanos",
      "Diplomada en Drogodependencias y Reducción de Daños",
      "Diplomada en Peritaje Social y Psicológico",
      "Diploma en Herramientas Psicolaborales",
      "Diplomada en Neurodesarrollo",
      "Acreditada en Test WISC-V",
      "Acreditada en Test ADOS-2",
      "Acreditada en Test ADI-R",
      "Zulliger",
      "PBLL",
      "TRO",
      "CAT-A/H"
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5],
    slots: { start: "09:00", end: "20:00", intervalMins: 60 },
    exceptions: {},
    booked: {},
    modalities: ["presencial", "online"],
  },
  {
    id: 3,
    name: "Stephany Troncoso",
    title: "Psicólogo Infantil",
    img: "/images/stephany.jpg",
    whatsapp: "56987654321",
    bio: "Con formación en psicología clínica y especialización en el ámbito infanto juvenil, Stephany Troncoso se destaca por su enfoque integral y empático en la atención de niños, niñas y adolescentes. Posee diplomados en Etnicidad y Género y en Terapia Infanto Juvenil, que respaldan su mirada inclusiva y respetuosa de la diversidad.",
    specialties: ["Psicología Infantil", "TDAH", "Trastornos del Espectro Autista", "Terapia Familiar"],
    education: [
      "Psicóloga Clínica Infanto Juvenil.",
      "Diplomado en Etnicidad y Género.",
      "Diplomado en Terapia Infanto Juvenil.",
      "Formación continua en temáticas de desarrollo infantil, habilidades parentales y salud mental adolescente.",
      "Participación en seminarios sobre regulación emocional, autoestima y orientación vocacional."
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5],
    slots: { start: "09:00", end: "20:00", intervalMins: 60 },
    exceptions: {},
    booked: {},
    modalities: ["presencial"],
  },
];

// ============= AUTH FUNCIONES =================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// ============= LOGIN =================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Credenciales inválidas" });
});

// ============= ENDPOINTS PROFESIONALES ============
app.get("/api/profesionales", (req, res) => {
  res.json(profesionales);
});

app.get("/api/profesionales/:id", authenticateToken, (req, res) => {
  const prof = profesionales.find((p) => p.id === Number(req.params.id));
  if (!prof) return res.status(404).json({ error: "Perfil no encontrado" });
  res.json(prof);
});

app.put("/api/profesionales/:id", authenticateToken, (req, res) => {
  const profIndex = profesionales.findIndex((p) => p.id === Number(req.params.id));
  if (profIndex === -1) return res.status(404).json({ error: "Perfil no encontrado" });
  profesionales[profIndex] = { ...profesionales[profIndex], ...req.body };
  res.json(profesionales[profIndex]);
});

// ============= ENVIAR EMAIL =============
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



// ============= CREAR TRANSACCIÓN WEBPAY =============
app.post('/api/payment/create', async (req, res) => {
  console.log("Body recibido en backend:", req.body);
  try {
    const { amount, buyOrder, sessionId, returnUrl } = req.body;
    if (!amount || !buyOrder || !sessionId || !returnUrl) {
      console.log("❌ Faltan parámetros requeridos:", { amount, buyOrder, sessionId, returnUrl });
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    console.log("✔️ Respuesta Transbank:", response);
    res.json({
      token: response.token,
      url: response.url,
    });
  } catch (error) {
    console.error('❌ Error creating Webpay transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

// ============= ENDPOINT DE COMMIT (compatibilidad con frontend existente) =============
app.post('/api/payment/commit', async (req, res) => {
  console.log("Body recibido en commit:", req.body);
  try {
    const { token, formData, professional, selectedDate, selectedSlot, buyOrder, amount } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token no recibido' });
    }

    // Delay de 1 segundo antes de commitear
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Commit con reintentos
    const response = await commitWithRetry(token, 3);
    if (response.response_code !== 0) {
      return res.status(400).json({ error: 'La transacción fue rechazada por Transbank', data: response });
    }

    console.log("✔️ Transacción confirmada:", response);

    // Enviar email
    if (formData && professional) {
      const emailSent = await sendConfirmationEmail(
        formData.correo,
        formData,
        professional,
        new Date(selectedDate),
        selectedSlot,
        buyOrder,
        amount
      );
      console.log("📧 Email enviado:", emailSent);
    }

    // Enviar WhatsApp
    if (formData && professional && typeof formData.telefono === "string" && formData.telefono.length > 8) {
      try {
        // Normaliza el número: agrega whatsapp: si no está y quita espacios extras
        let telefonoWs = formData.telefono.trim();
        // Asegúrate que empieza con + (WhatsApp API solo acepta formato internacional)
        if (!telefonoWs.startsWith('+')) {
          console.warn("⚠️ El teléfono debería tener el código internacional, e.g., +56912345678");
          // Puedes decidir qué hacer si no tiene el +, por ejemplo agregar uno para Chile, pero si lo dejas así lo envía tal cual.
        }
        if (!telefonoWs.startsWith("whatsapp:")) {
          telefonoWs = `whatsapp:${telefonoWs}`;
        }

        const whatsappMsg = `✅ ¡Pago confirmado!\n\nOrden: ${buyOrder}\nMonto: $${amount.toLocaleString('es-CL')}\nProfesional: ${professional.name}\nFecha: ${new Date(selectedDate).toLocaleDateString('es-CL')}\nHora: ${selectedSlot}`;
        await client.messages.create({
          body: whatsappMsg,
          from: process.env.TWILIO_NUMBER,
          to: telefonoWs
        });
        console.log("✅ WhatsApp enviado a", telefonoWs);
      } catch (waError) {
        console.error("⚠️ Error WhatsApp:", waError);
      }
    }


    res.json({
      success: true,
      message: 'Pago confirmado exitosamente',
      data: response
    });
  } catch (error) {
    console.error('❌ Error en commit:', error);
    res.status(500).json({ error: 'Error confirmando transacción' });
  }
});


// ============= FUNCIÓN AUXILIAR: COMMIT CON REINTENTOS =============
async function commitWithRetry(token, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 Intento ${i + 1}/${maxRetries} de commit...`);
      const response = await tx.commit(token);
      console.log(`✅ Commit exitoso en intento ${i + 1}`);
      return response;
    } catch (error) {
      console.error(`❌ Intento ${i + 1} falló:`, error.message);

      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`⏳ Esperando ${delay}ms antes de reintentar...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// ============= CREAR RESERVA CON TRANSFERENCIA =============
app.post('/api/reservations', async (req, res) => {
  try {
    const { formData, professional, selectedDate, selectedSlot, selectedModality, amount, buyOrder, paymentMethod, status } = req.body;

    if (!formData || !professional || !selectedDate || !selectedSlot || !amount || !buyOrder) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    console.log('📝 Creando reserva:', { buyOrder, formData, professional, paymentMethod, status });

    // Simular guardado en BD (en producción guardas en base de datos real)
    const reservation = {
      id: `RES-${Date.now()}`,
      buyOrder,
      formData,
      professional,
      selectedDate,
      selectedSlot,
      selectedModality,
      amount,
      paymentMethod, // 'TRANSFER' o 'WEBPAY'
      status, // 'PENDING', 'CONFIRMED', 'COMPLETED'
      createdAt: new Date().toISOString(),
    };

    console.log('✅ Reserva creada:', reservation);

    // Aquí puedes guardar en BD, por ahora devolvemos el objeto
    res.json(reservation);

  } catch (error) {
    console.error('❌ Error creando reserva:', error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// ============= WHATSAPP BOT CON GEMINI IA ============
app.post('/webhook', async (req, res) => {
  const incomingMsg = req.body.Body?.toLowerCase() || "";
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
  try {
    await client.messages.create({
      body: respuesta,
      from: process.env.TWILIO_NUMBER,
      to: from
    });
  } catch (err) {
    console.error("❌ Error Twilio:", err);
  }

  res.send('<Response></Response>');
});

// ============= TEST y HEALTH ============
app.get('/api/test-cors', (req, res) => {
  res.json({ origin: req.headers.origin || null });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcional ✓' });
});

// ============= INICIAR SERVIDOR SOLO UNA VEZ =========
app.listen(3000, () => {
  console.log('🚀 Backend escuchando en puerto 3000');
  console.log('✅ Transbank Webpay + Email configurado');
  console.log('✅ WhatsApp Bot con Gemini IA configurado');
  console.log('📧 Email:', process.env.EMAIL_USER);
});
