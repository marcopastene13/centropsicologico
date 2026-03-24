const path = require('path');

module.exports = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
