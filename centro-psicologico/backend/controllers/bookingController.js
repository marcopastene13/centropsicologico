const { Reserva, Profesional } = require('../models');
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

// Motivo por el que no hay horas, para que el frontend muestre un mensaje claro.
const motivoSinHoras = (profesional, fecha) => {
  const h = profesional.horarioSemanal;
  const configurado = h && typeof h === 'object' && Object.values(h).some(d => d && d.activo);
  if (!configurado) return 'sin_horario';
  if ((profesional.fechasBloqueadas || []).some(b => b.fecha === fecha)) return 'bloqueada';
  const dia = DIAS_SEMANA[new Date(fecha + 'T12:00:00').getDay()];
  if (!h[dia] || !h[dia].activo) return 'no_atiende';
  return 'completo';
};

// Fecha y hora actuales en Chile (el servidor corre en UTC).
const ahoraEnChile = () => {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }).formatToParts(new Date()).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  return {
    hoyStr: `${partes.year}-${partes.month}-${partes.day}`,
    minutos: (Number(partes.hour) % 24) * 60 + Number(partes.minute)
  };
};

const MODALIDADES = { online: 'Online', presencial: 'Presencial' };

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
    const hayBase = horasDisponibles.length > 0;

    if (horasDisponibles.length > 0) {
      const reservas = await Reserva.findAll({
        where: { profesionalId, fecha, estado: { [Op.ne]: 'cancelada' } },
        attributes: ['hora']
      });
      const horasOcupadas = reservas.map(r => r.hora);
      horasDisponibles = horasDisponibles.filter(h => !horasOcupadas.includes(h));

      // Si la fecha consultada es hoy, sacar las horas que ya pasaron
      const { hoyStr, minutos } = ahoraEnChile();
      if (fecha === hoyStr) {
        horasDisponibles = horasDisponibles.filter(h => toMinutos(h) > minutos);
      }
    }

    const motivo = horasDisponibles.length > 0 ? null
      : (hayBase ? 'completo' : motivoSinHoras(profesional, fecha));
    res.json({ fecha, profesionalId, horasDisponibles, motivo });
  } catch (err) {
    console.error('Error getAvailableSlots:', err);
    res.status(500).json({ message: 'Error al obtener horarios' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { profesionalId, fecha, hora, nombrePaciente, emailPaciente, telefonoPaciente, motivo, servicio, modalidad } = req.body;
    if (!profesionalId || !fecha || !hora || !nombrePaciente || !emailPaciente || !telefonoPaciente) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (modalidad && !MODALIDADES[modalidad]) {
      return res.status(400).json({ message: 'Modalidad invalida' });
    }
    const { hoyStr } = ahoraEnChile();
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
    const modalidadTxt = modalidad ? MODALIDADES[modalidad] : '';
    const servicioFinal = [servicio, modalidadTxt && `Atención ${modalidadTxt.toLowerCase()}`].filter(Boolean).join(' · ');
    const reserva = await Reserva.create({
      profesionalId,
      fecha,
      hora,
      pacienteNombre: nombrePaciente,
      pacienteEmail: emailPaciente,
      pacienteTelefono: telefonoPaciente,
      motivo: motivo || '',
      servicio: servicioFinal,
      estado: 'pendiente'
    });
    // Notificaciones por email (no bloqueante: si falla, la reserva ya quedo creada igual)
    try {
      await sendBookingEmailToPatient({
        nombrePaciente, emailPaciente, profesionalNombre: profesional.nombre, fecha, hora, servicio, modalidad: modalidadTxt
      });
      await sendBookingEmailToProfessional({
        profesionalNombre: profesional.nombre, profesionalEmail: profesional.email,
        pacienteNombre: nombrePaciente, pacienteTelefono: telefonoPaciente, pacienteEmail: emailPaciente, fecha, hora, servicio, modalidad: modalidadTxt, motivo
      });
    } catch (emailErr) {
      console.warn('Email no configurado o fallo el envio:', emailErr.message);
    }
    res.status(201).json({
      message: 'Solicitud de hora recibida',
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