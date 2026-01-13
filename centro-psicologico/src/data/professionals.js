/**
 * Datos centralizados de profesionales
 * Punto único de verdad para toda la aplicación
 */

export const professionals = [
  {
    id: 1,
    name: "Patricia Santander",
    title: "Psícologa Clínica",
    img: "/images/patty.jpg",
    whatsapp: "56932736893",
    bio: "Patricia Santander, Directora y Psícologa Clínica desde 2016 en Maipú, especialista en psicodiagnóstico, terapia individual y víctimas de ASI. También ejerce como Perito Judicial Forense, elaborando informes y evaluaciones en contextos penales y familiares.",
    specialties: [
      "Psicodiagnóstico avanzado",
      "Ley Karin",
      "Peritaje judicial forense",
      "Evaluación en contextos penales y familiares"
    ],
    education: [
      "Diplomado en Peritaje Psicológico y Social en Contexto Judicial | Universidad Andrés Bello (UNAB) | 2023",
      "Diplomado Internacional Estrategias Clínicas Terapia Breve | ADIPA | 2021",
      "Curso Peritaje Psicológico en contexto familiar | Instituto Virtulys | 2021",
      "Curso Psicopatología Forense: Herramientas para la Evaluación Pericial Psicológica | Instituto Grupo Palermo | 2018",
      "Título Profesional de Psícologa con Grado Académico de Licenciada en Psicología | Universidad de Las Américas(UDLA) | 2015",
      "Seminario 'Psicología Forense y Jurídica' | Universidad Bernardo O'Higgins (UBO) | 2015",
      "Seminario 'Expresiones de la Violencia de Género' | Universidad de Concepción (UDC) | 2015",
      "Seminario 'Autocuidado y Manejo de las Emociones en Niños Preadolescentes' | Universidad de Las Américas(UDLA) | 2013",
      "Seminario 'Apego en la Primera Infancia' | Universidad de Chile (UDCH) | 2012",
      "Cátedra Grafología | Universidad de Las Américas (UDLA) | 2012",
      "Especialización en investigación Ley Karin con perspectiva de género"
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5],
    slots: { start: "09:00", end: "20:00", intervalMins: 60 },
    exceptions: {},
    booked: {},
    modalities: ["presencial", "online", "pack4"],
    seoDescription: "Psícologa clínica especializada en terapia de adultos, psicodiagnóstico y peritaje judicial. Atiende en Maipú.",
    seoKeywords: ["psícologa Maipú", "terapia adultos", "psicodiagnóstico"]
  },
  {
    id: 2,
    name: "Yasna Valdes",
    title: "Psícologo Infantil",
    img: "/images/yasna.jpg",
    whatsapp: "56987654321",
    bio: "Psícologa clínica egresada con distinción máxima con más de 10 años de experiencia. Especialista en tratamiento de procesos de reparación en vulneración de derechos, abordaje de trastornos del ánimo y conducta. Experta en psicodiagnóstico y trabajo en equipos multidisciplinarios.",
    specialties: [
      "Psicología Infantil",
      "TDAH",
      "Trastornos del Espectro Autista",
      "Terapia Familiar"
    ],
    education: [
      "Psícologa clínica",
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
    seoDescription: "Psícologa infantil con 10+ años de experiencia. Especialista en TDAH, autismo y terapia familiar.",
    seoKeywords: ["psícologa infantil", "TDAH", "terapia familiar"]
  },
  {
    id: 3,
    name: "Stephany Troncoso",
    title: "Psícologo Clínico Infanto Juvenil",
    img: "/images/stephany.jpg",
    whatsapp: "56987654321",
    bio: "Con formación en psicología clínica y especialización en el ámbito infanto juvenil, Stephany Troncoso se destaca por su enfoque integral y empático en la atención de niños, niñas y adolescentes. Posee diplomados en Etnicidad y Género y en Terapia Infanto Juvenil.",
    specialties: [
      "Psicología Infantil",
      "TDAH",
      "Trastornos del Espectro Autista",
      "Terapia Familiar"
    ],
    education: [
      "Psícologa Clínica Infanto Juvenil",
      "Diplomado en Etnicidad y Género",
      "Diplomado en Terapia Infanto Juvenil",
      "Formación continua en temáticas de desarrollo infantil, habilidades parentales y salud mental adolescente",
      "Participación en seminarios sobre regulación emocional, autoestima y orientación vocacional"
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5],
    slots: { start: "09:00", end: "20:00", intervalMins: 60 },
    exceptions: {},
    booked: {},
    modalities: ["presencial"],
    seoDescription: "Psícologa infantil con enfoque en género y diversidad. Especialista en terapia infanto-juvenil.",
    seoKeywords: ["psícologa infantil", "terapia adolescentes", "género"]
  }
];

export const getProfessionalById = (id) => {
  return professionals.find((p) => p.id === parseInt(id)) || null;
};

export const getProfessionalsByService = (serviceId) => {
  const serviceMap = {
    adultos: [1],
    infantil: [2, 3],
    pareja: [1, 2, 3],
    online: [1, 2]
  };
  return professionals.filter((p) => serviceMap[serviceId]?.includes(p.id));
};

export default professionals;