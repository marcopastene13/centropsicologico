require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Usuario } = require('../models');

const NUEVO_EMAIL = 'cconsultapsicologica@gmail.com';
const NUEVA_PASSWORD = 'centenario123';

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');
    const hash = await bcrypt.hash(NUEVA_PASSWORD, 10);
    let admin = await Usuario.findOne({ where: { rol: 'admin' } });
    if (admin) {
      await admin.update({ email: NUEVO_EMAIL, password: hash });
      console.log('Usuario admin actualizado.');
    } else {
      admin = await Usuario.create({
        nombre: 'Administrador Centro',
        email: NUEVO_EMAIL,
        password: hash,
        rol: 'admin',
        activo: true
      });
      console.log('No existia un admin, se creo uno nuevo.');
    }
    console.log('');
    console.log('Listo. Nuevas credenciales de acceso a /admin:');
    console.log('  Email:    ' + NUEVO_EMAIL);
    console.log('  Password: ' + NUEVA_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('Error completo:', err);
    process.exit(1);
  }
};
run();
