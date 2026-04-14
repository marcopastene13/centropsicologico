const path = require('path');

// Configuracion de base de datos
// - Desarrollo local: SQLite (sin configuracion necesaria)
// - Produccion: PostgreSQL via DATABASE_URL

let config;

if (process.env.DATABASE_URL) {
  // PRODUCCION: PostgreSQL (Neon, Railway, Render, Supabase, etc.)
  config = {
    dialect: 'postgres',
    url: process.env.DATABASE_URL,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  };
} else {
  // DESARROLLO LOCAL: SQLite
  config = {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  };
}

module.exports = config;