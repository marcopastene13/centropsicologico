require('dotenv').config();
const { sequelize, Profesional, Usuario } = require('../models');
const bcrypt = require('bcrypt');

const profesionales = [
  { nombre: 'Dra. Maria Jose Munoz', especialidad: 'Psicologia Clinica', descripcion: 'Especialista en terapia cognitivo-conductual, ansiedad, depresion y manejo del estres. Mas de 10 anos de experiencia.', telefono: '+56912345678', email: 'dra.munoz@centropsicologico.cl', foto: '/assets/profesionales/dra-munoz.jpg', experiencia: '10 anos de experiencia. Magister Psicologia Clinica U. de Chile. TCC.', activo: true },
  { nombre: 'Ps. Carlos Herrera', especialidad: 'Psicologia Infanto-Juvenil', descripcion: 'Especialista en ninos, adolescentes y familias. Experto en TDAH, problemas de aprendizaje y conducta.', telefono: '+56987654321', email: 'ps.herrera@centropsicologico.cl', foto: '/assets/profesionales/ps-herrera.jpg', experiencia: '8 anos. Diplomado Neuropsicologia Infantil.', activo: true },
  { nombre: 'Ps. Valentina Castro', especialidad: 'Psicologia de Pareja y Familia', descripcion: 'Especialista en terapia de pareja, mediacion familiar y comunicacion.', telefono: '+56911223344', email: 'ps.castro@centropsicologico.cl', foto: '/assets/profesionales/ps-castro.jpg', experiencia: '6 anos. Magister Terapia Familiar Sistemica.', activo: true }
];

const runSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada.');
    await sequelize.sync({ force: true });
    console.log('Tablas creadas.');
    for (const prof of profesionales) {
      await Profesional.create(prof);
      console.log(' - ' + prof.nombre);
    }
    const hash = await bcrypt.hash('Admin2026!', 10);
    await Usuario.create({ nombre: 'Administrador', email: 'admin@centropsicologico.cl', password: hash, rol: 'admin', activo: true });
    console.log(' - Admin: admin@centropsicologico.cl / Admin2026!');
    console.log('Seeder completado!');
    process.exit(0);
  } catch (err) { console.error(err.message); process.exit(1); }
};
runSeed();
