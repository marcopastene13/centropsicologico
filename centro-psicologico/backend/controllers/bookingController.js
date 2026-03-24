const { Reserva, Profesional, Usuario } = require('../models');
const twilio = require('twilio');

// Obtener todas las reservas
exports.getAllBookings = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Profesional, as: 'profesional' },
        { model: Usuario, as: 'paciente' }
      ],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Obtener una reserva por ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id, {
      include: [
        { model: Profesional, as: 'profesional' },
        { model: Usuario, as: 'paciente' }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(reserva);
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
};

// Crear nueva reserva
exports.createBooking = async (req, res) => {
  try {
    const { profesionalId, fecha, hora, nombre, email, telefono, motivo } = req.body;

    // Verificar si el profesional existe
    const profesional = await Profesional.findByPk(profesionalId);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    // Verificar disponibilidad de la hora
    const reservaExistente = await Reserva.findOne({
      where: { profesionalId, fecha, hora, estado: 'confirmada' }
    });

    if (reservaExistente) {
      return res.status(400).json({ error: 'Esta hora ya está reservada' });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      profesionalId,
      fecha,
      hora,
      pacienteNombre: nombre,
      pacienteEmail: email,
      pacienteTelefono: telefono,
      motivo,
      estado: 'confirmada'
    });

    // Enviar notificación por WhatsApp (Twilio)
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // Mensaje para el paciente
      await client.messages.create({
        body: `Hola ${nombre}, tu reserva para el ${fecha} a las ${hora} con ${profesional.nombre} ha sido confirmada. Centro Psicológico Centenario.`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${telefono}`
      });

      // Mensaje para el doctor
      await client.messages.create({
        body: `Nueva reserva: ${nombre} (${telefono}) para el ${fecha} a las ${hora}. Motivo: ${motivo}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${profesional.telefono}`
      });
    } catch (twilioError) {
      console.error('Error al enviar WhatsApp:', twilioError);
      // No fallar la reserva si falla el mensaje
    }

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};

// Actualizar reserva
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, estado, motivo } = req.body;

    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    await reserva.update({ fecha, hora, estado, motivo });

    res.json({
      message: 'Reserva actualizada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
};

// Cancelar/Eliminar reserva
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    await reserva.update({ estado: 'cancelada' });

    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
};

// Obtener horas disponibles para un profesional en una fecha
exports.getAvailableSlots = async (req, res) => {
  try {
    const { profesionalId, fecha } = req.query;

    if (!profesionalId || !fecha) {
      return res.status(400).json({ error: 'Se requiere profesionalId y fecha' });
    }

    // Obtener reservas existentes para ese día
    const reservas = await Reserva.findAll({
      where: {
        profesionalId,
        fecha,
        estado: 'confirmada'
      },
      attributes: ['hora']
    });

    const horasOcupadas = reservas.map(r => r.hora);

    // Horarios disponibles (9:00 AM a 6:00 PM)
    const horariosDisponibles = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const horasDisponibles = horariosDisponibles.filter(
      hora => !horasOcupadas.includes(hora)
    );

    res.json({ disponibles: horasDisponibles });
  } catch (error) {
    console.error('Error al obtener horas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener horas disponibles' });
  }
};
