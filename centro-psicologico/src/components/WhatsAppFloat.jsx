// src/components/WhatsAppFloat.jsx

import { useState } from 'react';
import '../styles/WhatsAppFloat.css';

const WhatsAppFloat = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  // Número de WhatsApp del centro (actualiza con el número real)
  const whatsappNumber = '56912345678'; // Cambia por el número real sin + ni espacios
  
  // Mensaje predefinido
  const defaultMessage = encodeURIComponent(
    '¡Hola! Me gustaría obtener más información sobre los servicios del Centro Psicológico Centenario.'
  );
  
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;
  
  return (
    <div 
      className="whatsapp-float"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <a 
        href={whatsappLink}
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-button"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg"
          className="whatsapp-icon"
        >
          <path
            fill="currentColor"
            d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.050-13.485 13.485-13.485s13.485 6.050 13.485 13.485c0 7.435-6.050 13.485-13.485 13.485zM21.960 18.231c-0.292-0.146-1.724-0.850-1.99-0.948s-0.462-0.146-0.656 0.146c-0.194 0.292-0.754 0.948-0.924 1.143s-0.340 0.219-0.632 0.073c-0.292-0.146-1.232-0.454-2.346-1.447-0.868-0.774-1.454-1.729-1.625-2.021s-0.018-0.450 0.128-0.595c0.131-0.131 0.292-0.340 0.438-0.511s0.194-0.292 0.292-0.487c0.097-0.194 0.049-0.365-0.024-0.511s-0.656-1.579-0.899-2.164c-0.237-0.570-0.478-0.492-0.656-0.501-0.170-0.008-0.365-0.010-0.559-0.010s-0.511 0.073-0.779 0.365c-0.268 0.292-1.024 1.001-1.024 2.442s1.048 2.833 1.194 3.028c0.146 0.194 2.059 3.144 4.990 4.409 0.697 0.301 1.241 0.481 1.665 0.616 0.699 0.222 1.336 0.191 1.839 0.116 0.561-0.084 1.724-0.705 1.967-1.385s0.243-1.264 0.170-1.385c-0.073-0.121-0.268-0.194-0.559-0.340z"
          />
        </svg>
      </a>
      
      {isTooltipVisible && (
        <div className="whatsapp-tooltip">
          ¿Necesitas ayuda? ¡Escríbenos!
        </div>
      )}
    </div>
  );
};

export default WhatsAppFloat;
