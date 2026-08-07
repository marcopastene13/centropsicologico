const path = require('path');

let config;

if (process.env.DATABASE_URL) {
  // PRODUCCION: PostgreSQL (Neon, Supabase, etc.)
  const dbUrl = process.env.DATABASE_URL.split('?')[0];
  config = {
    dialect: 'postgres',
    url: dbUrl,
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
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  };
}

module.exports = config;
