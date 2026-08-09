const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const NUEVO_EMAIL = 'cconsultapsicologica@gmail.com';
const NUEVA_PASSWORD = 'centenario123';

router.get('/admin', async (req, res) => {
  try {
    if (req.query.secret !== process.env.JWT_SECRET) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const hash = await bcrypt.hash(NUEVA_PASSWORD, 10);
    let admin = await Usuario.findOne({ where: { rol: 'admin' } });
    if (admin) {
      await admin.update({ email: NUEVO_EMAIL, password: hash });
      return res.json({ message: 'Admin actualizado', email: NUEVO_EMAIL });
    }
    admin = await Usuario.create({
      nombre: 'Administrador Centro',
      email: NUEVO_EMAIL,
      password: hash,
      rol: 'admin',
      activo: true
    });
    res.json({ message: 'Admin creado', email: NUEVO_EMAIL });
  } catch (err) {
    console.error('Error setup admin:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
