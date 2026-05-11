const { Sequelize } = require('sequelize');
const config = require('../config/database');

let sequelize;

if (config.url) {
  // Produccion: PostgreSQL con URL
  sequelize = new Sequelize(config.url, {
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: config.dialectOptions,
    pool: config.pool
  });
} else {
  // Desarrollo: SQLite con storage
  sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: config.logging,
    pool: config.pool
  });
}

const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const Profesional = require('./Profesional')(sequelize, Sequelize.DataTypes);
const Reserva = require('./Reserva')(sequelize, Sequelize.DataTypes);

Profesional.hasMany(Reserva, { foreignKey: 'profesionalId', as: 'reservas' });
Reserva.belongsTo(Profesional, { foreignKey: 'profesionalId', as: 'profesional' });
Usuario.hasMany(Reserva, { foreignKey: 'pacienteId', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'pacienteId', as: 'paciente' });

module.exports = { sequelize, Sequelize, Usuario, Profesional, Reserva };
