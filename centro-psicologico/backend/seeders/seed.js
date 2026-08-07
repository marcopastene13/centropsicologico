require('dotenv').config();
const { sequelize, Profesional, Usuario } = require('../models');
const bcrypt = require('bcrypt');

const profesionales = [
  {
    nombre: 'Patricia Santander',
    especialidad: 'Psicologia Clinica - Adultos',
    descripcion: 'Psicologa clinica especializada en terapia de adultos y manejo de ansiedad. Especialista en Peritaje Judicial Forense y Ley Karin. 10 anos de experiencia.',
    telefono: '+56912345678',
    email: 'patricia.santander@centropsicologico.cl',
    foto: '/images/professionals/patty.jpg',
    experiencia: '10 anos de experiencia clinica. Especialidad en Peritaje Judicial Forense, Ley Karin y terapia de adultos.',
    activo: true
  },
  {
    nombre: 'Yasna Valdes',
    especialidad: 'Psicologia Clinica - Psicodiagnostico',
    descripcion: 'Psicologa clinica con mas de 10 anos en reparacion de derechos, diagnostico y manejo de trastornos. Experta en TDAH y vulneracion de derechos.',
    telefono: '+56923456789',
    email: 'yasna.valdes@centropsicologico.cl',
    foto: '/images/professionals/yasna.jpg',
    experiencia: 'Mas de 10 anos de experiencia. Especialidad en Psicodiagnostico, TDAH y vulneracion de derechos.',
    activo: true
  },
  {
    nombre: 'Stephany Troncoso',
    especialidad: 'Psicologia Infanto-Juvenil',
    descripcion: 'Psicologa clinica infanto juvenil, especializada en trastornos emocionales, conducta, desarrollo y orientacion familiar.',
    telefono: '+56934567890',
    email: 'stephany.troncoso@centropsicologico.cl',
    foto: '/images/professionals/stephany.jpg',
    experiencia: 'Especialidad en Psicologia infantil, TDAH y terapia familiar. Atencion infanto juvenil.',
    activo: true
  }
];

const runSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada.');
    await sequelize.sync({ force: true });
    console.log('Tablas recreadas.');
    for (const prof of profesionales) {
      await Profesional.create(prof);
      console.log(' - ' + prof.nombre + ' creada.');
    }
    const hash = await bcrypt.hash('Admin2026!', 10);
    await Usuario.create({
      nombre: 'Administrador Centro',
      email: 'admin@centropsicologico.cl',
      password: hash,
      rol: 'admin',
      activo: true
    });
    console.log(' - Admin: admin@centropsicologico.cl / Admin2026!');
    console.log('');
    console.log('Seeder completado! 3 profesionales + 1 admin.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};
runSeed();
