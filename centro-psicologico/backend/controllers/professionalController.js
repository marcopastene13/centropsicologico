const { Profesional, Reserva } = require('../models');

// Obtener todos los profesionales
exports.getAllProfessionals = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
    res.json(profesionales);
  } catch (error) {
    console.error('Error al obtener profesionales:', error);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
};

// Obtener un profesional por ID
exports.getProfessionalById = async (req, res) => {
  try {
    const { id } = req.params;
    const profesional = await Profesional.findByPk(id, {
      include: [{
        model: Reserva,
        as: 'reservas',
        where: { estado: 'confirmada' },
        required: false
      }]
    });

    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    res.json(profesional);
  } catch (error) {
    console.error('Error al obtener profesional:', error);
    res.status(500).json({ error: 'Error al obtener profesional' });
  }
};

// Crear nuevo profesional
exports.createProfessional = async (req, res) => {
  try {
    const {
      nombre,
      especialidad,
      descripcion,
      telefono,
      email,
      foto,
      experiencia
    } = req.body;

    const nuevoProfesional = await Profesional.create({
      nombre,
      especialidad,
      descripcion,
      telefono,
      email,
      foto,
      experiencia,
      activo: true
    });

    res.status(201).json({
      message: 'Profesional creado exitosamente',
      profesional: nuevoProfesional
    });
  } catch (error) {
    console.error('Error al crear profesional:', error);
    res.status(500).json({ error: 'Error al crear profesional' });
  }
};

// Actualizar profesional
exports.updateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const profesional = await Profesional.findByPk(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    await profesional.update(updateData);

    res.json({
      message: 'Profesional actualizado exitosamente',
      profesional
    });
  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    res.status(500).json({ error: 'Error al actualizar profesional' });
  }
};

// Desactivar profesional
exports.deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;

    const profesional = await Profesional.findByPk(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    await profesional.update({ activo: false });

    res.json({ message: 'Profesional desactivado exitosamente' });
  } catch (error) {
    console.error('Error al desactivar profesional:', error);
    res.status(500).json({ error: 'Error al desactivar profesional' });
  }
};
