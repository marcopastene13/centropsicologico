import React from 'react';

const WhatsAppFloat = () => {
  const phoneNumber = '56912345678';
  const message = encodeURIComponent('Hola, me gustaria obtener mas informacion sobre los servicios del Centro Psicologico Centenario.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

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
