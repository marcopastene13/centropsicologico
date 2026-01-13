/**
 * Accesibilidad WCAG AA
 * Directrices para hacer la app accesible
 */

// Verificar contraste de colores (WCAG AA)
export const checkContrast = (foreground, background) => {
  // Calcula la luminancia relativa
  const getLuminance = (color) => {
    const c = parseInt(color.substring(1), 16);
    const r = (c >> 16) & 0xff;
    const g = (c >> 8) & 0xff;
    const b = (c >> 0) & 0xff;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.03928 ? luminance / 12.92 : Math.pow((luminance + 0.055) / 1.055, 2.4);
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return ratio >= 4.5; // WCAG AA requires 4.5:1
};

// Componente con aria-labels mejorados
export const A11yButton = ({ label, ariaLabel, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      title={ariaLabel || label}
      role="button"
      tabIndex={0}
    >
      {children || label}
    </button>
  );
};

// Anunciar cambios dinámicos a usuarios de screen readers
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.display = 'none';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};

export default { checkContrast, A11yButton, announceToScreenReader };