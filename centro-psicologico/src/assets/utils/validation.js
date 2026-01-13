/**
 * Validaciones de datos para seguridad en frontend
 */

export const isValidRUT = (rut) => {
  if (!rut) return false;
  const cleanRut = rut.replace(/\./g, '').replace('-', '');
  const rutRegex = /^\d{7,8}[0-9kK]$/;
  return rutRegex.test(cleanRut);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+56)?9\d{8}$/;
  return phoneRegex.test(phone?.replace(/\s/g, ''));
};

export const validateReservationForm = (formData) => {
  const errors = {};

  if (!formData.nombre?.trim()) {
    errors.nombre = 'El nombre es requerido';
  }

  if (!isValidRUT(formData.rut)) {
    errors.rut = 'RUT inválido';
  }

  if (!isValidEmail(formData.correo)) {
    errors.correo = 'Email inválido';
  }

  if (!isValidPhone(formData.telefono)) {
    errors.telefono = 'Teléfono inválido';
  }

  if (!formData.detalles?.trim() || formData.detalles.length < 10) {
    errors.detalles = 'Mínimo 10 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default { isValidRUT, isValidEmail, isValidPhone, validateReservationForm };