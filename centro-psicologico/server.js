import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const SECRET_KEY = "123456";

const corsOptions = {
  origin: [
    "https://shiny-engine-pjvvrg5xqjx3xvr-5173.app.github.dev",
    "https://shiny-engine-pjvvrg5xqjx3xvr-4000.app.github.dev"
  ],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

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

app.post("/login", (req, res) => {
  console.log("Login body:", req.body);
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Credenciales inválidas" });
});

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
      "Curso Peritaje Psicológico en contexto familiar  | Instituto Virtulys | 2021",
      "Curso Psicopatología Forense: Herramientas para la Evaluación Pericial Psicológica | Instituto Grupo Palermo | 2018",
      "Título Profesional de Psicóloga con Grado Académico de Licenciada en Psicología | Universidad de Las Américas(UDLA) | 2015",
      "Seminario “Psicología Forense y Jurídica” | Universidad Bernardo O'Higgins (UBO) | 2015",
      "Seminario “Expresiones de la Violencia de Género” | Universidad de Concepción (UDC) | 2015",
      "Seminario “Autocuidado y Manejo de las Emociones en Niños Preadolescentes” | Universidad de Las Américas(UDLA) | 2013",
      "Seminario “Apego en la Primera Infancia” | Universidad de Chile (UDCH) | 2012",
      "Cátedra Grafología | Universidad de Las Américas (UDLA) | 2012"
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5], // 1=Lunes ... 5=Viernes
    slots: { start: "09:00", end: "20:00", intervalMins: 60 }, // cada 60m
    exceptions: {
    },
    booked: {
    },
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
    workingDays: [1, 2, 3, 4, 5], // 1=Lunes ... 5=Viernes
    slots: { start: "09:00", end: "20:00", intervalMins: 60 }, // cada 60m
    exceptions: {
    },
    booked: {
    },
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
    workingDays: [1, 2, 3, 4, 5], // 1=Lunes ... 5=Viernes
    slots: { start: "09:00", end: "20:00", intervalMins: 60 }, // cada 60m
    exceptions: {
    },
    booked: {
    },
    modalities: ["presencial"],
  },
];

// Rutas protegidas con autenticación
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

app.listen(4000, "0.0.0.0", () => {
  console.log("API backend corriendo en http://localhost:4000");
});
