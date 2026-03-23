const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Opciones adicionales para producción
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Número máximo de clientes en el pool
  idleTimeoutMillis: 30000, // Tiempo que un cliente puede estar inactivo antes de ser cerrado
  connectionTimeoutMillis: 2000, // Tiempo de espera para conectar
});

// Event listeners para debugging
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

// Función helper para consultas
const query = (text, params) => pool.query(text, params);

// Función para obtener un cliente del pool (para transacciones)
const getClient = () => pool.connect();

module.exports = {
  query,
  getClient,
  pool
};
