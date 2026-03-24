const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validación para registro de usuario
const validateRegister = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

// Validación para login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

// Validación para reservas
const validateBooking = [
  body('profesionalId')
    .notEmpty()
    .withMessage('El ID del profesional es requerido')
    .isInt()
    .withMessage('El ID del profesional debe ser un número'),
  body('fecha')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .isDate()
    .withMessage('Debe ser una fecha válida'),
  body('hora')
    .notEmpty()
    .withMessage('La hora es requerida')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora debe estar en formato HH:MM'),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Debe ser un número de teléfono válido'),
  body('motivo')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('El motivo no puede exceder los 500 caracteres'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking,
  handleValidationErrors
};
