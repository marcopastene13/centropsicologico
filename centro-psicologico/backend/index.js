require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const professionalRoutes = require('./routes/professionals');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARES =====
// Debug universal
app.use((req, res, next) => {
  console.log(`=== \${req.method} \${req.url} ===`);
  next();
});

// CORS
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== RUTAS API =====
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/professionals', professionalRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Centro Psicol\u00f3gico Centenario',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      professionals: '/api/professionals'
    }
  });
});

// Ruta de health check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===== INICIAR SERVIDOR =====
const startServer = async () => {
  try {
    // Verificar conexi\u00f3n a la base de datos
    await sequelize.authenticate();
    console.log('\u2705 Conexi\u00f3n a la base de datos establecida exitosamente');

    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('\u2705 Modelos sincronizados con la base de datos');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\u2705 Servidor corriendo en puerto \${PORT}`);
      console.log(`\ud83c\udf0d Ambiente: \${process.env.NODE_ENV || 'development'}`);
      console.log(`\ud83d\udce1 API disponible en: http://localhost:\${PORT}`);
    });
  } catch (error) {
    console.error('\u274c Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
