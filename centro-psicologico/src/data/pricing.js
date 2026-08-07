/**
 * Valores de sesion por profesional.
 * Los nombres deben coincidir con el campo "nombre" que devuelve el backend
 * (tabla profesionales). Si un profesional no aparece aca, simplemente no
 * se muestra el cuadro de valores para el (no genera error).
 */

const preciosPatriciaYasna = [
  { id: "individual", label: "Psicoterapia individual", price: 38000, note: "por sesión" },
  { id: "pack4", label: "Copago preferencial", price: 135000, note: "pack de 4 sesiones" },
  { id: "pareja", label: "Terapia de pareja", price: 55000, note: "por sesión" },
  { id: "pack4-pareja", label: "Copago terapia de pareja", price: 190000, note: "pack de 4 sesiones" },
];

export const pricingByProfessional = {
  "Patricia Santander": preciosPatriciaYasna,
  "Yasna Valdes": preciosPatriciaYasna,
  "Stephany Troncoso": [
    { id: "individual", label: "Psicoterapia individual", price: 27000, note: "por sesión" },
  ],
};

// Formatea a "$38.000"
export const formatCLP = (valor) => `$${valor.toLocaleString("es-CL")}`;

// Busqueda tolerante: exacta primero, si no encuentra, intenta por coincidencia parcial
// (por si el nombre en la BD trae un apellido de mas o un espacio distinto).
export const getPricingFor = (nombre) => {
  if (!nombre) return null;
  if (pricingByProfessional[nombre]) return pricingByProfessional[nombre];

  const normalizado = nombre.trim().toLowerCase();
  const match = Object.keys(pricingByProfessional).find(
    (key) =>
      key.toLowerCase() === normalizado ||
      normalizado.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalizado)
  );
  return match ? pricingByProfessional[match] : null;
};

export default pricingByProfessional;
