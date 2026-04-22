import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfesionalById, fetchHorariosDisponibles, crearReserva } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ProfessionalDetail.css';
import allServices from '../data/services';

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
    const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
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
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailPaciente)) {
      errors.emailPaciente = 'Email invalido';
    }
    if (!form.telefonoPaciente.trim()) {
      errors.telefonoPaciente = 'El telefono es obligatorio';
        } else if (!/^[+]?[\d\s()-]{7,15}$/.test(form.telefonoPaciente)) {
      errors.telefonoPaciente = 'Telefono invalido';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!servicio) { toast.error('Debes seleccionar un servicio'); return; }
    if (!hora) { toast.error('Debes seleccionar una hora'); return; }
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    setEnviando(true);
    try {
      const resultado = await crearReserva({
        profesionalId: id, fecha, hora, servicio, ...form
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
        {/* 4 CARDS HORIZONTALES */}
        <div className="row g-4">

          {/* CARD 0: SERVICIO */}
              <div className="col-12 col-md-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-header text-white text-center" style={{backgroundColor:'#4a6fa5'}}>
                    <h5 className="mb-0">1. Selecciona el Servicio</h5>
                  </div>
                  <div className="card-body d-flex flex-column p-2">
                    <div className="servicio-list flex-grow-1">
                      {allServices.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          className={'btn btn-sm w-100 mb-2 text-start ' + (servicio === s.title ? 'btn-primary active' : 'btn-outline-secondary')}
                          onClick={() => setServicio(s.title)}
                        >
                          <span className="me-2">{s.icon}</span>
                          {s.title}
                        </button>
                      ))}
                    </div>
                    {servicio && (
                      <p className="cal-selected mt-2 mb-0">
                        <strong>{servicio}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 1: FECHA */}
          <div className="col-12 col-md-3">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-white text-center" style={{backgroundColor:'#4a6fa5'}}>
                <h5 className="mb-0">2. Selecciona la Fecha</h5>
              </div>
              <div className="card-body fecha-card-body p-2">
            {/* Navegación mes/año */}
            <div className="cal-nav">
              <button type="button" className="cal-nav-btn" onClick={() => {
                const d = new Date(calYear, calMonth - 1, 1);
                d.setMonth(d.getMonth() - 1);
                setCalMonth(d.getMonth() + 1);
                setCalYear(d.getFullYear());
              }}>&#8249;</button>
              <span className="cal-title">
                {new Date(calYear, calMonth - 1).toLocaleString('es-CL', {month:'long', year:'numeric'})}
              </span>
              <button type="button" className="cal-nav-btn" onClick={() => {
                const d = new Date(calYear, calMonth - 1, 1);
                d.setMonth(d.getMonth() + 1);
                setCalMonth(d.getMonth() + 1);
                setCalYear(d.getFullYear());
              }}>&#8250;</button>
            </div>
            {/* Días de la semana */}
                                        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px',marginBottom:'3px'}}>
              {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d => (
                <div key={d} className="cal-dow">{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {(() => {
                const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
                const offset = firstDay === 0 ? 6 : firstDay - 1;
                const daysInMonth = new Date(calYear, calMonth, 0).getDate();
                const cells = [];
                for (let i = 0; i < offset; i++) cells.push(<div key={'e'+i} />);
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = `${calYear}-${String(calMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                  const todayStr = hoy();
                  const isPast = dateStr < todayStr;
                  const isSelected = fecha === dateStr;
                  cells.push(
                    <button
                      key={d}
                      type="button"
                      className={`cal-day${isSelected ? ' selected' : ''}${isPast ? ' past' : ''}`}
                      onClick={() => !isPast && setFecha(dateStr)}
                      disabled={isPast}
                    >{d}</button>
                  );
                }
                return cells;
              })()}
            </div>
            {fecha && <p className="cal-selected">Fecha: <strong>{new Date(fecha+'T12:00:00').toLocaleDateString('es-CL',{weekday:'long',day:'numeric',month:'long'})}</strong></p>}
          </div>
            </div>
          </div>

          {/* CARD 2: HORA */}
          <div className="col-12 col-md-3">
            <div className="card h-100 shadow-sm">
              <div className="card-header text-white text-center" style={{backgroundColor:'#4a6fa5'}}>
                <h5 className="mb-0">3. Selecciona la Hora</h5>
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
          <div className="col-12 col-md-3">
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