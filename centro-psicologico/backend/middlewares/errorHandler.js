// Middleware centralizado para manejo de errores

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de validación de express-validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.details
    });
  }

  // Error de base de datos
  if (err.code === '23505') { // Violación de unique constraint
    return res.status(409).json({
      error: 'El recurso ya existe',
      detail: err.detail
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Referencia inválida',
      detail: err.detail
    });
  }

  // Error de autenticación
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Token inválido o expirado'
    });
  }

  // Error genérico del servidor
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
