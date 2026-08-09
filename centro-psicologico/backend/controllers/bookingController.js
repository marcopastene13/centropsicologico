const { Reserva, Profesional } = require('../models');
const { notifyPatient, notifyProfessional } = require('../utils/whatsappService');
const { sendBookingEmailToPatient, sendBookingEmailToProfessional } = require('../utils/emailService');
const { Op } = require('sequelize');

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

const toMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toHHMM = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

// Genera los horarios de un dia especifico segun la config de ese profesional
const generarSlotsDelDia = (horarioDia, duracionMin) => {
  if (!horarioDia || !horarioDia.activo || !horarioDia.inicio || !horarioDia.fin) return [];
  const slots = [];
  const inicio = toMinutos(horarioDia.inicio);
  const fin = toMinutos(horarioDia.fin);
  const pausaInicio = horarioDia.pausaInicio ? toMinutos(horarioDia.pausaInicio) : null;
  const pausaFin = horarioDia.pausaFin ? toMinutos(horarioDia.pausaFin) : null;
  let cursor = inicio;
  while (cursor + duracionMin <= fin) {
    const enPausa = pausaInicio !== null && pausaFin !== null && cursor < pausaFin && (cursor + duracionMin) > pausaInicio;
    if (!enPausa) slots.push(toHHMM(cursor));
    cursor += duracionMin;
  }
  return slots;
};

// Devuelve los horarios base (sin filtrar ocupados) de un profesional para una fecha dada.
// Retorna null si ese dia el profesional no atiende o la fecha esta bloqueada puntualmente.
const getSlotsBaseParaFecha = (profesional, fecha) => {
  const bloqueada = (profesional.fechasBloqueadas || []).some(b => b.fecha === fecha);
  if (bloqueada) return null;

  const diaSemana = DIAS_SEMANA[new Date(fecha + 'T12:00:00').getDay()];
  const horarioDia = profesional.horarioSemanal ? profesional.horarioSemanal[diaSemana] : null;
  if (!horarioDia || !horarioDia.activo) return null;

  return generarSlotsDelDia(horarioDia, profesional.duracionSesionMin || 60);
};

const getAvailableSlots = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;
    if (!profesionalId || !fecha) {
      return res.status(400).json({ message: 'Faltan parametros: profesionalId y fecha' });
    }
    const profesional = await Profesional.findByPk(profesionalId);
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    const slotsBase = getSlotsBaseParaFecha(profesional, fecha);
    let horasDisponibles = slotsBase || [];

    if (horasDisponibles.length > 0) {
      const reservas = await Reserva.findAll({
        where: { profesionalId, fecha, estado: { [Op.ne]: 'cancelada' } },
        attributes: ['hora']
      });
      const horasOcupadas = reservas.map(r => r.hora);
      horasDisponibles = horasDisponibles.filter(h => !horasOcupadas.includes(h));

      // Si la fecha consultada es hoy, sacar las horas que ya pasaron
      const ahora = new Date();
      const hoyStr = ahora.toISOString().split('T')[0];
      if (fecha === hoyStr) {
        const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
        horasDisponibles = horasDisponibles.filter(h => toMinutos(h) > horaActual);
      }
    }

    res.json({ fecha, profesionalId, horasDisponibles });
  } catch (err) {
    console.error('Error getAvailableSlots:', err);
    res.status(500).json({ message: 'Error al obtener horarios' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { profesionalId, fecha, hora, nombrePaciente, emailPaciente, telefonoPaciente, motivo, servicio } = req.body;
    if (!profesionalId || !fecha || !hora || !nombrePaciente || !emailPaciente || !telefonoPaciente) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const hoyStr = new Date().toISOString().split('T')[0];
    if (fecha < hoyStr) {
      return res.status(400).json({ message: 'No puedes reservar en una fecha pasada' });
    }
    const profesional = await Profesional.findByPk(profesionalId);
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }
    const slotsValidos = getSlotsBaseParaFecha(profesional, fecha) || [];
    if (!slotsValidos.includes(hora)) {
      return res.status(400).json({ message: 'Ese horario no esta disponible para este profesional' });
    }
    // Verificar disponibilidad
    const existente = await Reserva.findOne({
      where: { profesionalId, fecha, hora, estado: { [Op.ne]: 'cancelada' } }
    });
    if (existente) {
      return res.status(409).json({ message: 'Ese horario ya esta reservado, elige otro' });
    }
    const reserva = await Reserva.create({
      profesionalId,
      fecha,
      hora,
      pacienteNombre: nombrePaciente,
      pacienteEmail: emailPaciente,
      pacienteTelefono: telefonoPaciente,
      motivo: motivo || '',
      servicio: servicio || '',
      estado: 'pendiente'
    });
    // Notificaciones (no bloqueantes: si fallan, la reserva ya quedo creada igual)
    try {
      await notifyPatient(
        { nombrePaciente, telefono: telefonoPaciente, fecha, hora },
        profesional
      );
      await notifyProfessional(
        { nombrePaciente, fecha, hora, motivo },
        profesional
      );
    } catch (waErr) {
      console.warn('WhatsApp no configurado o fallo el envio:', waErr.message);
    }
    try {
      await sendBookingEmailToPatient({
        nombrePaciente, emailPaciente, profesionalNombre: profesional.nombre, fecha, hora, servicio
      });
      await sendBookingEmailToProfessional({
        profesionalNombre: profesional.nombre, profesionalEmail: profesional.email,
        pacienteNombre: nombrePaciente, pacienteTelefono: telefonoPaciente, fecha, hora, servicio, motivo
      });
    } catch (emailErr) {
      console.warn('Email no configurado o fallo el envio:', emailErr.message);
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
      include: [{ model: Profesional, as: 'profesional', attributes: ['nombre', 'especialidad'] }],
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