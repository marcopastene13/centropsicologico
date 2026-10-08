import React from 'react';
import { whatsappUrl as buildWhatsappUrl } from '../data/contact';

const WhatsAppFloat = () => {
  const whatsappUrl = buildWhatsappUrl('Hola, me gustaria obtener mas informacion sobre los servicios del Centro Psicologico Centenario.');

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Contactanos por WhatsApp"
      aria-label="Contactar por WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
};

export default WhatsAppFloat;
