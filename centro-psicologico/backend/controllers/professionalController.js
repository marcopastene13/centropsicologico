const { Profesional, Reserva } = require('../models');

// Obtener todos los profesionales
exports.getAllProfessionals = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'especialidad', 'descripcion', 'foto', 'email', 'telefono']
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
      attributes: ['id', 'nombre', 'especialidad', 'descripcion', 'foto', 'email', 'telefono']
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

// Crear profesional (admin)
exports.createProfessional = async (req, res) => {
  try {
    const { nombre, especialidad, descripcion, foto, email, telefono } = req.body;
    if (!nombre || !especialidad) {
      return res.status(400).json({ error: 'Nombre y especialidad son requeridos' });
    }
    const profesional = await Profesional.create({ nombre, especialidad, descripcion, foto, email, telefono, activo: true });
    res.status(201).json(profesional);
  } catch (error) {
    console.error('Error al crear profesional:', error);
    res.status(500).json({ error: 'Error al crear profesional' });
  }
};

// Actualizar profesional (admin)
exports.updateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, descripcion, foto, email, telefono, activo } = req.body;
    const profesional = await Profesional.findByPk(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    await profesional.update({ nombre, especialidad, descripcion, foto, email, telefono, activo });
    res.json(profesional);
  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    res.status(500).json({ error: 'Error al actualizar profesional' });
  }
};

// Eliminar/desactivar profesional (admin)
exports.deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const profesional = await Profesional.findByPk(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    await profesional.update({ activo: false });
    res.json({ message: 'Profesional desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar profesional:', error);
    res.status(500).json({ error: 'Error al desactivar profesional' });
  }
};

// Obtener horario/config de agenda de un profesional (admin)
exports.getSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const profesional = await Profesional.findByPk(id, {
      attributes: ['id', 'nombre', 'horarioSemanal', 'duracionSesionMin', 'fechasBloqueadas']
    });
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    res.json(profesional);
  } catch (error) {
    console.error('Error al obtener horario:', error);
    res.status(500).json({ error: 'Error al obtener horario' });
  }
};

const DIAS_VALIDOS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validarHorarioSemanal = (horarioSemanal) => {
  if (typeof horarioSemanal !== 'object' || horarioSemanal === null) return 'horarioSemanal debe ser un objeto';
  for (const dia of Object.keys(horarioSemanal)) {
    if (!DIAS_VALIDOS.includes(dia)) return `Dia invalido: ${dia}`;
    const d = horarioSemanal[dia];
    if (d.activo) {
      if (!HORA_REGEX.test(d.inicio) || !HORA_REGEX.test(d.fin)) return `Horario invalido en ${dia}`;
      if (d.inicio >= d.fin) return `La hora de inicio debe ser antes que la de fin (${dia})`;
      if (d.pausaInicio && d.pausaFin) {
        if (!HORA_REGEX.test(d.pausaInicio) || !HORA_REGEX.test(d.pausaFin)) return `Pausa invalida en ${dia}`;
        if (d.pausaInicio >= d.pausaFin) return `La pausa de ${dia} debe empezar antes de terminar`;
      }
    }
  }
  return null;
};

// Actualizar horario/config de agenda de un profesional (admin)
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { horarioSemanal, duracionSesionMin, fechasBloqueadas } = req.body;
    const profesional = await Profesional.findByPk(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    const updates = {};
    if (horarioSemanal !== undefined) {
      const errorMsg = validarHorarioSemanal(horarioSemanal);
      if (errorMsg) return res.status(400).json({ error: errorMsg });
      updates.horarioSemanal = horarioSemanal;
    }
    if (duracionSesionMin !== undefined) {
      const dur = parseInt(duracionSesionMin, 10);
      if (!dur || dur < 10 || dur > 240) return res.status(400).json({ error: 'Duracion de sesion invalida (entre 10 y 240 minutos)' });
      updates.duracionSesionMin = dur;
    }
    if (fechasBloqueadas !== undefined) {
      if (!Array.isArray(fechasBloqueadas)) return res.status(400).json({ error: 'fechasBloqueadas debe ser una lista' });
      updates.fechasBloqueadas = fechasBloqueadas;
    }
    await profesional.update(updates);
    res.json(profesional);
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ error: 'Error al actualizar horario' });
  }
};

// Obtener disponibilidad de un profesional para una fecha
exports.getAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Fecha requerida (date)' });
    }
    const profesional = await Profesional.findByPk(id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }
    const horas = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
    const reservas = await Reserva.findAll({
      where: { profesionalId: id, fecha: date }
    });
    const ocupadas = reservas.map(r => r.hora);
    const disponibles = horas.filter(h => !ocupadas.includes(h));
    res.json({ disponibles, fecha: date });
  } catch (error) {
    console.error('Error disponibilidad:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};