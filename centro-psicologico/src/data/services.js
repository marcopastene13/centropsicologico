/**
 * Datos centralizados de servicios
 */

export const allServices = [
  {
    id: "adultos",
    title: "Psicoterapia adultos",
    desc: "Acompañamiento en crisis, ansiedad, depresión y procesos de cambio vital.",
    icon: "💱",
    seoTitle: "Psicoterapia para adultos en Maipú",
    seoDescription: "Terapia psicológica para adultos especializada en ansiedad, depresión y cambios vitales."
  },
  {
    id: "infantil",
    title: "Psicoterapia infantil y adolescente",
    desc: "Intervención especializada para niños, niñas y jóvenes, junto a sus familias.",
    icon: "📕",
    seoTitle: "Psicoterapia infantil y adolescente en Maipú",
    seoDescription: "Terapia especializada para niños y adolescentes con enfoque familiar."
  },
  {
    id: "pareja",
    title: "Terapia de pareja",
    desc: "Apoyo en conflictos de pareja, comunicación y proyectos de vida en común.",
    icon: "💑",
    seoTitle: "Terapia de pareja en Maipú",
    seoDescription: "Apoyo especializado en resolución de conflictos y mejora de comunicación de pareja."
  },
  {
    id: "online",
    title: "Atención online",
    desc: "Sesiones remotas para facilitar tu acceso a apoyo psicológico desde donde estés.",
    icon: "💻",
    seoTitle: "Psicoterapia online en Chile",
    seoDescription: "Consultas psicológicas virtuales desde cualquier lugar de Chile."
  }
];

export const getServiceById = (id) => {
  return allServices.find((s) => s.id === id) || null;
};

export default allServices;