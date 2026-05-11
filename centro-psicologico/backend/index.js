require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const professionalRoutes = require('./routes/professionals');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// CORS dinamico por entorno
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /\.github.dev$/,
  'https://centropsicologicocentenario.cl',
  'https://www.centropsicologicocentenario.cl',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/contact', contactRoutes);

// Ruta raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API Centro Psicologico Centenario',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      professionals: '/api/professionals',
      contact: '/api/contact'
    }
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'OK', database: 'Connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: error.message });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Iniciar servidor

const startServer = async () => {
  // Arrancar Express primero, sin esperar la BD
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 Modo: ${process.env.NODE_ENV || 'production'}`);
  });
      console.log('🔗 DB URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 40) + '...' : 'NO DEFINIDA');

  // Conectar BD con reintentos en segundo plano
  const connectDB = async (retries = 10, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada');
        await sequelize.sync({ alter: false });
        console.log('✅ Modelos sincronizados');
                // Auto-seed: insertar profesionales si la tabla está vacía
        try {
          const { Profesional } = require('./models');
          const count = await Profesional.count();
          if (count === 0) {
            console.log('🌱 Insertando profesionales de seed...');
            await Profesional.bulkCreate([
              {
                nombre: 'Patricia Santander',
                especialidad: 'Psicologia Clinica - Adultos',
                descripcion: 'Psicologa clinica especializada en terapia de adultos y manejo de ansiedad. Experiencia en terapia cognitivo-conductual.',
                telefono: '+56912345678',
                email: 'patricia.santander@centropsicologico.cl',
                foto: '/images/professionals/patty.jpg',
                experiencia: '10 años de experiencia clinica. Especialidad en Peritaje Judicial Forense, Ley VIF.',
                activo: true
              },
              {
                nombre: 'Yasna Valdes',
                especialidad: 'Psicologia Clinica - Psicodiagnostico',
                descripcion: 'Psicologa clinica con mas de 10 años en reparacion de derechos, diagnostico y evaluaciones.',
                telefono: '+56923456789',
                email: 'yasna.valdes@centropsicologico.cl',
                foto: '/images/professionals/yasna.jpg',
                experiencia: 'Mas de 10 anos de experiencia. Especialidad en Psicodiagnostico, TDAH y vulneracion de derechos.',
                activo: true
              },
              {
                nombre: 'Stephany Troncoso',
                especialidad: 'Psicologia Infanto-Juvenil',
                descripcion: 'Especialista en psicologia infantil y juvenil, con enfoque en intervencion temprana y apoyo familiar.',
                telefono: '+56934567890',
                email: 'stephany.troncoso@centropsicologico.cl',
                foto: '/images/professionals/stephany.jpg',
                experiencia: 'Especialista en atencion de ninos y adolescentes. Experiencia en colegios y centros de salud.',
                activo: true
              }
            ]);
            console.log('✅ Profesionales insertados correctamente');
          }
        } catch (seedError) {
          console.error('⚠️ Error al hacer seed de profesionales:', seedError.message);
        }
        return;
      } catch (error) {
        console.error(`❌ Intento ${i + 1}/${retries} fallido:`, error.error);
        if (i < retries - 1) {
          console.log(`⏳ Reintentando en ${delay / 1000}s...`);
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
    console.error('❌ No se pudo conectar a la base de datos después de varios intentos.');
  };

  connectDB();
};

startServer();
