/**
 * Detalles de modalidades de servicio (precios, descripción)
 */

export const serviceDetails = {
  presencial: {
    id: "presencial",
    label: "Terapia Presencial",
    description: "Sesión presencial en consulta, espacio privado y seguro en Maipú.",
    price: "$25.000",
    priceValue: 25000,
  },
  online: {
    id: "online",
    label: "Terapia Online",
    description: "Sesión por videollamada, flexibilidad para pacientes en todo Chile.",
    price: "$20.000",
    priceValue: 20000,
  },
  pack4: {
    id: "pack4",
    label: "Pack 4 Terapias Presenciales",
    description: "4 sesiones presenciales con descuento. Ideal para iniciar un proceso terapéutico estructurado.",
    price: "$80.000",
    priceValue: 80000,
    originalPrice: "$100.000",
    originalPriceValue: 100000,
    savings: "$20.000",
    savingsValue: 20000,
    sessions: 4,
  },
};

export const getServiceDetail = (modality) => {
  return serviceDetails[modality] || null;
};

export const isValidModality = (modality) => {
  return !!serviceDetails[modality];
};

export default serviceDetails;