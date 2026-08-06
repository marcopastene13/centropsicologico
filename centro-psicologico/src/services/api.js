const API_URL = import.meta.env.VITE_API_URL || '/api';

// Fetch con timeout configurable (default 60s para tolerar Render cold start)
const fetchWithTimeout = async (url, options = {}, timeoutMs = 60000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
};

const getHeaders = (token = null) => {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

// Wake-up: ping silencioso para despertar el servidor Render al cargar la app
export const wakeUpBackend = () => {
  fetch(`${API_URL}/health`, { method: 'GET' }).catch(() => {});
};

// PROFESIONALES
export const getProfessionals = async () => {
  const res = await fetchWithTimeout(`${API_URL}/professionals`);
  if (!res.ok) throw new Error('Error al cargar profesionales');
  return res.json();
};

export const fetchProfesionales = getProfessionals;

export const fetchProfesionalById = async (id) => {
  const res = await fetchWithTimeout(`${API_URL}/professionals/${id}`);
  if (!res.ok) throw new Error('Profesional no encontrado');
  return res.json();
};

// HORARIOS DISPONIBLES
export const fetchHorariosDisponibles = async (profesionalId, fecha) => {
  const res = await fetchWithTimeout(
    `${API_URL}/bookings/available?profesionalId=${profesionalId}&fecha=${fecha}`
  );
  if (!res.ok) throw new Error('Error al cargar horarios');
  return res.json();
};

// CREAR RESERVA
export const crearReserva = async (datos) => {
  const res = await fetchWithTimeout(`${API_URL}/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear reserva');
  return data;
};

// GESTION DE RESERVAS (admin, requiere token)
export const fetchReservas = async (token) => {
  const res = await fetchWithTimeout(`${API_URL}/bookings`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error al cargar reservas (${res.status})`);
  return data;
};

export const actualizarEstadoReserva = async (id, estado, token) => {
  const res = await fetchWithTimeout(`${API_URL}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ estado })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error al actualizar reserva (${res.status})`);
  return data;
};

export const eliminarReserva = async (id, token) => {
  const res = await fetchWithTimeout(`${API_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error al eliminar reserva (${res.status})`);
  return data;
};

// CONTACTO
export const enviarContacto = async (datos) => {
  const res = await fetchWithTimeout(`${API_URL}/contact`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al enviar mensaje');
  return data;
};
