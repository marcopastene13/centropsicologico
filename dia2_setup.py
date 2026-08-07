import os

BASE = '/workspaces/centropsicologico/centro-psicologico'
SRC = BASE + '/src'
BACKEND = BASE + '/backend'

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[OK] {path}')

# ============================================================
# 1. BACKEND: bookingController.js con WhatsApp integrado
# ============================================================
booking_ctrl = r"""
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
    const horasDisponibles = HORAS_DISPONIBLES.filter(h => !horasOcupadas.includes(h));
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
      nombrePaciente,
      emailPaciente,
      telefonoPaciente,
      motivo: motivo || '',
      estado: 'pendiente'
    });
    // Notificaciones WhatsApp (no bloqueante)
    try {
      await notifyPatient({ nombrePaciente, telefonoPaciente, fecha, hora, profesional: profesional.nombre });
      await notifyProfessional({ profesional, fecha, hora, nombrePaciente, motivo });
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
""".strip()

write(BACKEND + '/controllers/bookingController.js', booking_ctrl)

# ============================================================
# 2. BACKEND: routes/bookings.js actualizado
# ============================================================
booking_routes = r"""
const express = require('express');
const router = express.Router();
const { getAvailableSlots, createBooking, getAllBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/auth');

router.get('/available', getAvailableSlots);
router.post('/', createBooking);
router.get('/', verifyToken, getAllBookings);
router.patch('/:id/status', verifyToken, updateBookingStatus);
router.delete('/:id', verifyToken, deleteBooking);

module.exports = router;
""".strip()

write(BACKEND + '/routes/bookings.js', booking_routes)

# ============================================================
# 3. BACKEND: contactController.js
# ============================================================
contact_ctrl = r"""
const nodemailer = require('nodemailer');

const sendContact = async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    // Validaciones
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Correo electronico invalido' });
    }
    const telRegex = /^[+]?[\\d\\s\\-()]{7,15}$/;
    if (!telRegex.test(telefono)) {
      return res.status(400).json({ message: 'Telefono invalido' });
    }
    // Si hay config de email, enviar
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Contacto Web - ${nombre}`,
        html: `<h3>Nuevo mensaje de contacto</h3>
               <p><b>Nombre:</b> ${nombre}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Telefono:</b> ${telefono}</p>
               <p><b>Mensaje:</b> ${mensaje}</p>`
      });
    }
    console.log(`[CONTACTO] ${nombre} | ${email} | ${telefono}`);
    res.json({ message: 'Mensaje enviado exitosamente. Nos contactaremos a la brevedad.' });
  } catch (err) {
    console.error('Error sendContact:', err);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};

module.exports = { sendContact };
""".strip()

write(BACKEND + '/controllers/contactController.js', contact_ctrl)

# ============================================================
# 4. BACKEND: routes/contact.js
# ============================================================
contact_route = r"""
const express = require('express');
const router = express.Router();
const { sendContact } = require('../controllers/contactController');
router.post('/', sendContact);
module.exports = router;
""".strip()

write(BACKEND + '/routes/contact.js', contact_route)

# ============================================================
# 5. BACKEND: index.js - agregar ruta contacto
# ============================================================
idx_path = BACKEND + '/index.js'
with open(idx_path, 'r', encoding='utf-8') as f:
    idx = f.read()

if "contact" not in idx:
    idx = idx.replace(
        "const profRoutes = require('./routes/professionals');",
        "const profRoutes = require('./routes/professionals');\nconst contactRoutes = require('./routes/contact');"
    )
    idx = idx.replace(
        "app.use('/api/professionals', profRoutes);",
        "app.use('/api/professionals', profRoutes);\napp.use('/api/contact', contactRoutes);"
    )
    write(idx_path, idx)
    print('[OK] index.js actualizado con ruta contacto')
else:
    print('[SKIP] index.js ya tiene ruta contacto')

print('\n=== BACKEND LISTO ===')
print('Archivos creados:')
print('  - bookingController.js (con WhatsApp)')
print('  - routes/bookings.js')
print('  - contactController.js')
print('  - routes/contact.js')
print('  - index.js actualizado')

# ============================================================
# 6. FRONTEND: api.js actualizado
# ============================================================
api_js = r"""
const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (token = null) => {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

// PROFESIONALES
export const fetchProfesionales = async () => {
  const res = await fetch(`${API_URL}/professionals`);
  if (!res.ok) throw new Error('Error al cargar profesionales');
  return res.json();
};

export const fetchProfesionalById = async (id) => {
  const res = await fetch(`${API_URL}/professionals/${id}`);
  if (!res.ok) throw new Error('Profesional no encontrado');
  return res.json();
};

// HORARIOS DISPONIBLES
export const fetchHorariosDisponibles = async (profesionalId, fecha) => {
  const res = await fetch(`${API_URL}/bookings/available?profesionalId=${profesionalId}&fecha=${fecha}`);
  if (!res.ok) throw new Error('Error al cargar horarios');
  return res.json();
};

// CREAR RESERVA
export const crearReserva = async (datos) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear reserva');
  return data;
};

// ADMIN: obtener todas las reservas
export const fetchReservas = async (token) => {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: getHeaders(token)
  });
  if (!res.ok) throw new Error('Error al cargar reservas');
  return res.json();
};

// ADMIN: actualizar estado reserva
export const actualizarEstadoReserva = async (id, estado, token) => {
  const res = await fetch(`${API_URL}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ estado })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar');
  return data;
};

// ADMIN: eliminar reserva
export const eliminarReserva = async (id, token) => {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  if (!res.ok) throw new Error('Error al eliminar');
  return res.json();
};

// LOGIN
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Credenciales incorrectas');
  return data;
};

// CONTACTO
export const enviarContacto = async (datos) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al enviar');
  return data;
};
""".strip()

write(SRC + '/services/api.js', api_js)

print('\n=== API.JS LISTO ===')

# ============================================================
# 7. FRONTEND: ProfessionalDetail.jsx - flujo reserva completo
# ============================================================
prof_detail = r"""
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfesionalById, fetchHorariosDisponibles, crearReserva } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const hoy = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const ProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profesional, setProfesional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Paso 1: fecha
  const [fecha, setFecha] = useState(hoy());
  // Paso 2: hora
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [hora, setHora] = useState('');
  // Paso 3: datos paciente
  const [form, setForm] = useState({
    nombrePaciente: '', emailPaciente: '', telefonoPaciente: '', motivo: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(null);

  useEffect(() => {
    fetchProfesionalById(id)
      .then(data => { setProfesional(data); setLoading(false); })
      .catch(() => { setError('No se pudo cargar el profesional'); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!fecha || !id) return;
    setHora('');
    setHorasDisponibles([]);
    setLoadingHoras(true);
    fetchHorariosDisponibles(id, fecha)
      .then(data => { setHorasDisponibles(data.horasDisponibles || []); setLoadingHoras(false); })
      .catch(() => { setLoadingHoras(false); });
  }, [fecha, id]);

  const validateForm = () => {
    const errors = {};
    if (!form.nombrePaciente.trim()) errors.nombrePaciente = 'El nombre es obligatorio';
    if (!form.emailPaciente.trim()) {
      errors.emailPaciente = 'El email es obligatorio';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.emailPaciente)) {
      errors.emailPaciente = 'Email invalido';
    }
    if (!form.telefonoPaciente.trim()) {
      errors.telefonoPaciente = 'El telefono es obligatorio';
    } else if (!/^[+]?[\\d\\s\\-()]{7,15}$/.test(form.telefonoPaciente)) {
      errors.telefonoPaciente = 'Telefono invalido';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hora) { toast.error('Debes seleccionar una hora'); return; }
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    setEnviando(true);
    try {
      const resultado = await crearReserva({
        profesionalId: id, fecha, hora, ...form
      });
      setReservaExitosa(resultado);
      toast.success('Reserva creada exitosamente!');
    } catch (err) {
      toast.error(err.message || 'Error al crear la reserva');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div><p className="mt-3">Cargando...</p></div>;
  if (error) return <div className="container py-5 text-center"><p className="text-danger">{error}</p><button className="btn btn-primary" onClick={() => navigate('/profesionales')}>Volver</button></div>;
  if (!profesional) return null;

  if (reservaExitosa) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-success">
              <div className="card-body text-center p-5">
                <div className="mb-3" style={{fontSize:'4rem'}}>&#10003;</div>
                <h3 className="text-success mb-3">Reserva Confirmada</h3>
                <p className="mb-1"><strong>Profesional:</strong> {reservaExitosa.reserva?.profesional}</p>
                <p className="mb-1"><strong>Fecha:</strong> {fecha}</p>
                <p className="mb-1"><strong>Hora:</strong> {hora}</p>
                <p className="text-muted mt-3">Recibirás una notificación de confirmación.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/profesionales')}>Volver a Profesionales</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={4000} />
      {/* Header profesional */}
      <div className="row mb-4 align-items-center">
        <div className="col-auto">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/profesionales')}>
            &larr; Volver
          </button>
        </div>
        <div className="col">
          <h2 className="mb-0" style={{color:'#4a6fa5'}}>{profesional.nombre}</h2>
          <p className="text-muted mb-0">{profesional.especialidad}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 3 CARDS HORIZONTALES */}
        <div className="row g-4">

          {/* CARD 1: FECHA */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-white text-center" style={{backgroundColor:'#4a6fa5'}}>
                <h5 className="mb-0">1. Selecciona la Fecha</h5>
              </div>
              <div className="card-body d-flex flex-column justify-content-center">
                <label className="form-label fw-bold">Fecha de la consulta</label>
                <input
                  type="date"
                  className="form-control"
                  value={fecha}
                  min={hoy()}
                  onChange={e => setFecha(e.target.value)}
                  required
                />
                {fecha && <p className="text-muted small mt-2 mb-0">Fecha seleccionada: <strong>{fecha}</strong></p>}
              </div>
            </div>
          </div>

          {/* CARD 2: HORA */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-white text-center" style={{backgroundColor:'#4a6fa5'}}>
                <h5 className="mb-0">2. Selecciona la Hora</h5>
              </div>
              <div className="card-body">
                {loadingHoras ? (
                  <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div><p className="small mt-2">Cargando horarios...</p></div>
                ) : horasDisponibles.length === 0 ? (
                  <p className="text-center text-muted py-3">No hay horarios disponibles para esta fecha.</p>
                ) : (
                  <div className="row g-2">
                    {horasDisponibles.map(h => (
                      <div className="col-6" key={h}>
                        <button
                          type="button"
                          className={`btn w-100 ${hora === h ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setHora(h)}
                        >
                          {h}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {hora && <p className="text-success small mt-2 mb-0">Hora seleccionada: <strong>{hora}</strong></p>}
              </div>
            </div>
          </div>

          {/* CARD 3: DATOS PACIENTE */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-white text-center" style={{backgroundColor:'#4a6fa5'}}>
                <h5 className="mb-0">3. Tus Datos</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Nombre completo *</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.nombrePaciente ? 'is-invalid' : ''}`}
                    value={form.nombrePaciente}
                    onChange={e => setForm({...form, nombrePaciente: e.target.value})}
                    placeholder="Tu nombre"
                  />
                  {formErrors.nombrePaciente && <div className="invalid-feedback">{formErrors.nombrePaciente}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.emailPaciente ? 'is-invalid' : ''}`}
                    value={form.emailPaciente}
                    onChange={e => setForm({...form, emailPaciente: e.target.value})}
                    placeholder="tu@email.cl"
                  />
                  {formErrors.emailPaciente && <div className="invalid-feedback">{formErrors.emailPaciente}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Telefono *</label>
                  <input
                    type="tel"
                    className={`form-control ${formErrors.telefonoPaciente ? 'is-invalid' : ''}`}
                    value={form.telefonoPaciente}
                    onChange={e => setForm({...form, telefonoPaciente: e.target.value})}
                    placeholder="+56 9 1234 5678"
                  />
                  {formErrors.telefonoPaciente && <div className="invalid-feedback">{formErrors.telefonoPaciente}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Motivo de consulta</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.motivo}
                    onChange={e => setForm({...form, motivo: e.target.value})}
                    placeholder="Describe brevemente tu consulta..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 text-white fw-bold"
                  style={{backgroundColor:'#4a6fa5'}}
                  disabled={enviando || !hora}
                >
                  {enviando ? 'Reservando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </div>
          </div>

        </div>{/* fin row */}
      </form>
    </div>
  );
};

export default ProfessionalDetail;
""".strip()

write(SRC + '/pages/ProfessionalDetail.jsx', prof_detail)
print('\n=== ProfessionalDetail.jsx LISTO ===')

# ============================================================
# 8. FRONTEND: AdminEditPanel.jsx - Panel de gestion de reservas
# ============================================================
admin_panel = r"""
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReservas, actualizarEstadoReserva, eliminarReserva } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ESTADOS = ['pendiente', 'confirmada', 'completada', 'cancelada'];
const ESTADO_COLORS = {
  pendiente: 'warning', confirmada: 'success', completada: 'primary', cancelada: 'danger'
};

const AdminEditPanel = ({ token, onLogout }) => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const data = await fetchReservas(token);
      setReservas(data);
    } catch (err) {
      toast.error('Error al cargar reservas. Verifica sesion.');
      if (err.message.includes('401') || err.message.includes('403')) {
        onLogout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarReservas(); }, []);

  const handleEstado = async (id, estado) => {
    try {
      await actualizarEstadoReserva(id, estado, token);
      toast.success('Estado actualizado');
      setReservas(prev => prev.map(r => r.id === id ? {...r, estado} : r));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarReserva(id, token);
      toast.success('Reserva eliminada');
      setReservas(prev => prev.filter(r => r.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const reservasFiltradas = reservas.filter(r => {
    const matchEstado = filtro === 'todas' || r.estado === filtro;
    const matchBusqueda = !busqueda ||
      r.nombrePaciente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.emailPaciente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.Profesional?.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  const stats = {
    total: reservas.length,
    pendientes: reservas.filter(r => r.estado === 'pendiente').length,
    confirmadas: reservas.filter(r => r.estado === 'confirmada').length,
    hoy: reservas.filter(r => r.fecha === new Date().toISOString().split('T')[0]).length,
  };

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 style={{color:'#4a6fa5'}}>Panel de Administracion</h2>
          <p className="text-muted mb-0">Centro Psicologico Centenario</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-danger btn-sm" onClick={() => { onLogout(); navigate('/'); }}>
            Cerrar Sesion
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="row g-3 mb-4">
        {[{label:'Total Reservas', val:stats.total, color:'primary'},
          {label:'Pendientes', val:stats.pendientes, color:'warning'},
          {label:'Confirmadas', val:stats.confirmadas, color:'success'},
          {label:'Hoy', val:stats.hoy, color:'info'}
        ].map(s => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className={`card border-${s.color} text-center`}>
              <div className="card-body py-3">
                <h3 className={`text-${s.color} mb-0`}>{s.val}</h3>
                <p className="text-muted small mb-0">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por paciente, email o profesional..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="todas">Todas las reservas</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase()+e.slice(1)}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-primary w-100" onClick={cargarReservas}>
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabla de reservas */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : reservasFiltradas.length === 0 ? (
        <div className="alert alert-info">No hay reservas que mostrar.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Contacto</th>
                <th>Profesional</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-muted">{i+1}</td>
                  <td><strong>{r.fecha}</strong></td>
                  <td>{r.hora}</td>
                  <td>{r.nombrePaciente}</td>
                  <td>
                    <small className="d-block">{r.emailPaciente}</small>
                    <small className="text-muted">{r.telefonoPaciente}</small>
                  </td>
                  <td>{r.Profesional?.nombre || '-'}<br/><small className="text-muted">{r.Profesional?.especialidad}</small></td>
                  <td><small>{r.motivo || '-'}</small></td>
                  <td>
                    <span className={`badge bg-${ESTADO_COLORS[r.estado] || 'secondary'}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {ESTADOS.filter(e => e !== r.estado).map(e => (
                        <button
                          key={e}
                          className={`btn btn-sm btn-outline-${ESTADO_COLORS[e]}`}
                          onClick={() => handleEstado(r.id, e)}
                          title={`Marcar como ${e}`}
                        >
                          {e.charAt(0).toUpperCase()}
                        </button>
                      ))}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmDelete(r.id)}
                        title="Eliminar"
                      >
                        X
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal confirmacion eliminar */}
      {confirmDelete && (
        <div className="modal d-block" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminacion</h5>
              </div>
              <div className="modal-body">
                <p>Esta seguro que desea eliminar esta reserva? Esta accion no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(confirmDelete)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditPanel;
""".strip()

write(SRC + '/components/AdminEditPanel.jsx', admin_panel)
print('\n=== AdminEditPanel.jsx LISTO ===')

# ============================================================
# 9. FRONTEND: ContactPage.jsx con validaciones completas
# ============================================================
contact_page = r"""
import React, { useState } from 'react';
import { enviarContacto } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialForm = { nombre: '', email: '', telefono: '', mensaje: '' };

const ContactPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    else if (form.nombre.trim().length < 3) errs.nombre = 'Nombre demasiado corto';
    if (!form.email.trim()) {
      errs.email = 'El email es obligatorio';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email)) {
      errs.email = 'Correo electronico invalido';
    }
    if (!form.telefono.trim()) {
      errs.telefono = 'El telefono es obligatorio';
    } else if (!/^[+]?[\\d\\s\\-()]{7,15}$/.test(form.telefono)) {
      errs.telefono = 'Telefono invalido (ej: +56 9 1234 5678)';
    }
    if (!form.mensaje.trim()) errs.mensaje = 'El mensaje es obligatorio';
    else if (form.mensaje.trim().length < 10) errs.mensaje = 'El mensaje es muy corto';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setEnviando(true);
    try {
      const res = await enviarContacto(form);
      toast.success(res.message || 'Mensaje enviado exitosamente!');
      setForm(initialForm);
      setEnviado(true);
    } catch (err) {
      toast.error(err.message || 'Error al enviar el mensaje');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-4">
            <h2 style={{color:'#4a6fa5'}}>Contactanos</h2>
            <p className="text-muted">Estamos disponibles para responder tus dudas y consultas.</p>
          </div>

          <div className="row g-4">
            {/* Info de contacto */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 style={{color:'#4a6fa5'}}>Informacion</h5>
                  <hr/>
                  <p className="mb-2"><strong>Direccion:</strong><br/>Los Libertadores 123, Santiago</p>
                  <p className="mb-2"><strong>Telefono:</strong><br/>+56 9 1234 5678</p>
                  <p className="mb-2"><strong>Email:</strong><br/>contacto@centropsicologico.cl</p>
                  <p className="mb-2"><strong>Horario:</strong><br/>Lunes a Viernes<br/>9:00 - 18:00 hrs</p>
                  <hr/>
                  <h6 style={{color:'#4a6fa5'}}>Nuestras Profesionales</h6>
                  <p className="mb-1 small">Patricia Santander</p>
                  <p className="mb-1 small">Yasna Valdes</p>
                  <p className="mb-0 small">Stephany Troncoso</p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  {enviado ? (
                    <div className="text-center py-4">
                      <div style={{fontSize:'3rem'}}>&#10003;</div>
                      <h4 className="text-success mt-2">Mensaje enviado!</h4>
                      <p className="text-muted">Nos contactaremos contigo a la brevedad.</p>
                      <button className="btn btn-primary" onClick={() => setEnviado(false)}>Enviar otro mensaje</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Nombre completo *</label>
                          <input
                            type="text"
                            name="nombre"
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                          />
                          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Telefono *</label>
                          <input
                            type="tel"
                            name="telefono"
                            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="+56 9 1234 5678"
                          />
                          {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Correo electronico *</label>
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@email.cl"
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="col-12">
                          <label className="form-label">Mensaje *</label>
                          <textarea
                            name="mensaje"
                            className={`form-control ${errors.mensaje ? 'is-invalid' : ''}`}
                            rows="4"
                            value={form.mensaje}
                            onChange={handleChange}
                            placeholder="Cuuntanos como podemos ayudarte..."
                          />
                          {errors.mensaje && <div className="invalid-feedback">{errors.mensaje}</div>}
                        </div>
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn w-100 text-white fw-bold py-2"
                            style={{backgroundColor:'#4a6fa5'}}
                            disabled={enviando}
                          >
                            {enviando ? 'Enviando...' : 'Enviar Mensaje'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
""".strip()

write(SRC + '/pages/ContactPage.jsx', contact_page)
print('\n=== ContactPage.jsx LISTO ===')

# ============================================================
# 10. FRONTEND: App.jsx actualizado con estado de autenticacion
# ============================================================
app_jsx = r"""
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Login from './components/Login';
import AdminEditPanel from './components/AdminEditPanel';

import MainPage from './pages/MainPage';
import ProfessionalsPage from './pages/ProfessionalsPage';
import ProfessionalDetail from './pages/ProfessionalDetail';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';

// Ruta protegida
const PrivateRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} />
      <Navbar token={token} onLogout={handleLogout} />
      <main style={{minHeight:'80vh'}}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/profesionales" element={<ProfessionalsPage />} />
          <Route path="/profesionales/:id" element={<ProfessionalDetail />} />
          <Route path="/sobrenosotros" element={<AboutUsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/edicion" element={
            <PrivateRoute token={token}>
              <AdminEditPanel token={token} onLogout={handleLogout} />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
    </BrowserRouter>
  );
};

export default App;
""".strip()

write(SRC + '/App.jsx', app_jsx)
print('\n=== App.jsx LISTO ===')

print('\n============================================')
print('DIA 2 - TODOS LOS ARCHIVOS GENERADOS EXITOSAMENTE')
print('============================================')
print('Backend:')
print('  bookingController.js  (con WhatsApp)')
print('  routes/bookings.js    (CRUD completo)')
print('  contactController.js  (formulario contacto)')
print('  routes/contact.js')
print('  index.js              (ruta /api/contact agregada)')
print('Frontend:')
print('  src/services/api.js   (todas las funciones API)')
print('  src/pages/ProfessionalDetail.jsx  (3 cards horizontales)')
print('  src/components/AdminEditPanel.jsx (panel admin completo)')
print('  src/pages/ContactPage.jsx         (validaciones completas)')
print('  src/App.jsx           (auth state + rutas limpias)')
