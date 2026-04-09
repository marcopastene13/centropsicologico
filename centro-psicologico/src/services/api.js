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

// Aliases para compatibilidad
export const getProfessionals = fetchProfesionales;
export const getProfessionalById = fetchProfesionalById;