const { Reserva, Profesional } = require('../models');
const { notifyPatient, notifyProfessional } = require('../utils/whatsappService');
const { Op } = require('sequelize');

const HORAS_DISPONIBLES = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

const getAvailableSlots = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;
    if (!profesionalId || !fecha) {
      return res.status(400).json({ message: 'Faltan parametros: profesionalId y fecha' });
    }
    const reservas = await Reserva.findAll({
      where: { profesionalId, fecha, estado: { [Op.ne]: 'cancelada' } },
      attributes: ['hora']
    });
    const horasOcupadas = reservas.map(r => r.hora);
    let horasDisponibles = HORAS_DISPONIBLES.filter(h => !horasOcupadas.includes(h));

    // Si la fecha consultada es hoy, sacar las horas que ya pasaron
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];
    if (fecha === hoyStr) {
      const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
      horasDisponibles = horasDisponibles.filter(h => {
        const [hh, mm] = h.split(':').map(Number);
        return (hh * 60 + mm) > horaActual;
      });
    }

    res.json({ fecha, profesionalId, horasDisponibles });
  } catch (err) {
    console.error('Error getAvailableSlots:', err);
    res.status(500).json({ message: 'Error al obtener horarios' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { profesionalId, fecha, hora, nombrePaciente, emailPaciente, telefonoPaciente, motivo } = req.body;
    if (!profesionalId || !fecha || !hora || !nombrePaciente || !emailPaciente || !telefonoPaciente) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (!HORAS_DISPONIBLES.includes(hora)) {
      return res.status(400).json({ message: 'Hora invalida' });
    }
    const hoyStr = new Date().toISOString().split('T')[0];
    if (fecha < hoyStr) {
      return res.status(400).json({ message: 'No puedes reservar en una fecha pasada' });
    }
    // Verificar disponibilidad
    const existente = await Reserva.findOne({
      where: { profesionalId, fecha, hora, estado: { [Op.ne]: 'cancelada' } }
    });
    if (existente) {
      return res.status(409).json({ message: 'Ese horario ya esta reservado, elige otro' });
    }
    const profesional = await Profesional.findByPk(profesionalId);
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }
    const reserva = await Reserva.create({
      profesionalId,
      fecha,
      hora,
      pacienteNombre: nombrePaciente,
      pacienteEmail: emailPaciente,
      pacienteTelefono: telefonoPaciente,
      motivo: motivo || '',
      estado: 'pendiente'
    });
    // Notificaciones WhatsApp (no bloqueante)
    try {
      await notifyPatient({ pacienteNombre: nombrePaciente, pacienteTelefono: telefonoPaciente, fecha, hora, profesional: profesional.nombre });
      await notifyProfessional({ profesional, fecha, hora, pacienteNombre: nombrePaciente, motivo });
    } catch (waErr) {
      console.warn('WhatsApp no configurado:', waErr.message);
    }
    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reserva: {
        id: reserva.id,
        fecha: reserva.fecha,
        hora: reserva.hora,
        profesional: profesional.nombre,
        estado: reserva.estado
      }
    });
  } catch (err) {
    console.error('Error createBooking:', err);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [{ model: Profesional, attributes: ['nombre', 'especialidad'] }],
      order: [['fecha', 'DESC'], ['hora', 'ASC']]
    });
    res.json(reservas);
  } catch (err) {
    console.error('Error getAllBookings:', err);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estados = ['pendiente', 'confirmada', 'cancelada', 'completada'];
    if (!estados.includes(estado)) {
      return res.status(400).json({ message: 'Estado invalido' });
    }
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    await reserva.update({ estado });
    res.json({ message: 'Estado actualizado', reserva });
  } catch (err) {
    console.error('Error updateBookingStatus:', err);
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    await reserva.destroy();
    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    console.error('Error deleteBooking:', err);
    res.status(500).json({ message: 'Error al eliminar reserva' });
  }
};

module.exports = { getAvailableSlots, createBooking, getAllBookings, updateBookingStatus, deleteBooking };