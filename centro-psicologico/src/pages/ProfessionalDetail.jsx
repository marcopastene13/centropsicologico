import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProfesionalById, fetchHorariosDisponibles, crearReserva } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ProfessionalDetail.css';
import { getPricingFor, formatCLP } from '../data/pricing';

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
  const [sesionId, setSesionId] = useState('');
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
    if (!sesionSeleccionada) { toast.error('Debes seleccionar el tipo de sesión'); return; }
    if (!hora) { toast.error('Debes seleccionar una hora'); return; }
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    setEnviando(true);
    const servicio = `${sesionSeleccionada.label} (${formatCLP(sesionSeleccionada.price)})`;
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

  const pricing = getPricingFor(profesional?.nombre);
  const sesionSeleccionada = pricing?.find(p => p.id === sesionId) || null;

  if (reservaExitosa) {
    return (
      <>
        <Helmet>
          <title>{profesional.nombre} — Psicólogo/a en Maipú | Centro Psicológico Centenario</title>
        </Helmet>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-success">
              <div className="card-body text-center p-5">
                <div className="mb-3" style={{fontSize:'4rem'}}>&#10003;</div>
                <h3 className="text-success mb-3">Reserva Confirmada</h3>
                <p className="mb-1"><strong>Profesional:</strong> {reservaExitosa.reserva?.profesional}</p>
                <p className="mb-1"><strong>Sesión:</strong> {sesionSeleccionada?.label} — {sesionSeleccionada && formatCLP(sesionSeleccionada.price)}</p>
                <p className="mb-1"><strong>Fecha:</strong> {fecha}</p>
                <p className="mb-1"><strong>Hora:</strong> {hora}</p>
                <p className="text-muted mt-3">Recibirás una notificación de confirmación.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/profesionales')}>Volver a Profesionales</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="container py-4">
      <Helmet>
        <title>{profesional.nombre} — Psicólogo/a en Maipú | Centro Psicológico Centenario</title>
        <meta name="description" content={`Agenda hora con ${profesional.nombre}, ${profesional.especialidad || 'psicóloga'} en Maipú. Atención presencial y online, reserva online en minutos.`} />
        <link rel="canonical" href={`https://www.centropsicologicocentenario.cl/profesionales/${id}`} />
      </Helmet>
      <ToastContainer position="top-right" autoClose={4000} />
      {/* Header profesional */}
      <div className="row mb-4 align-items-center">
        <div className="col-auto">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/profesionales')}>
            &larr; Volver
          </button>
        </div>
        <div className="col">
          <h2 className="mb-0" style={{color:'#4a6fa5'}}>{profesional?.nombre}</h2>
          <p className="text-muted mb-0">{profesional?.especialidad}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="progress-steps mb-4">
        {[
          { n: 1, label: 'Sesión', done: !!sesionSeleccionada },
          { n: 2, label: 'Fecha', done: !!fecha },
          { n: 3, label: 'Hora', done: !!hora },
          { n: 4, label: 'Tus datos', done: !!(form.nombrePaciente && form.emailPaciente && form.telefonoPaciente) },
        ].map((step, idx, arr) => (
          <React.Fragment key={step.n}>
            <div className={`step-node${step.done ? ' done' : ''}`}>
              <span className="step-circle">{step.done ? '✓' : step.n}</span>
              <span className="step-label">{step.label}</span>
            </div>
            {idx < arr.length - 1 && <span className={`step-line${step.done ? ' done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">

            {/* PASO 1: SESION */}
            <div className="card shadow-sm booking-card mb-4">
              <div className="card-header booking-card-header">
                <h5 className="mb-0">1. Elige tu sesión</h5>
              </div>
              <div className="card-body">
                {pricing && pricing.length > 0 ? (
                  <div className="row g-3">
                    {pricing.map(item => (
                      <div className="col-6 col-md-3" key={item.id}>
                        <button
                          type="button"
                          className={`session-card w-100 h-100${sesionId === item.id ? ' selected' : ''}`}
                          onClick={() => setSesionId(item.id)}
                        >
                          {sesionId === item.id && <span className="session-check">✓</span>}
                          <span className="session-label">{item.label}</span>
                          <span className="session-price">{formatCLP(item.price)}</span>
                          {item.note && <span className="session-note">{item.note}</span>}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">Aún no hay valores cargados para este profesional. Contáctanos para más información.</p>
                )}
              </div>
            </div>

            {/* PASO 2 y 3: FECHA + HORA */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card h-100 shadow-sm booking-card">
                  <div className="card-header booking-card-header">
                    <h5 className="mb-0">2. Elige la fecha</h5>
                  </div>
                  <div className="card-body fecha-card-body p-2">
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

              <div className="col-md-6">
                <div className="card h-100 shadow-sm booking-card">
                  <div className="card-header booking-card-header">
                    <h5 className="mb-0">3. Elige la hora</h5>
                  </div>
                  <div className="card-body d-flex flex-column">
                    {loadingHoras ? (
                      <div className="text-center py-4 flex-grow-1"><div className="spinner-border spinner-border-sm text-primary"></div><p className="small mt-2 mb-0">Cargando horarios...</p></div>
                    ) : horasDisponibles.length === 0 ? (
                      <div className="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
                        <p className="text-muted mb-0">No hay horarios disponibles para esta fecha. Prueba otro día.</p>
                      </div>
                    ) : (
                      <div className="hora-grid flex-grow-1">
                        {horasDisponibles.map(h => (
                          <button
                            key={h}
                            type="button"
                            className={`hora-btn${hora === h ? ' selected' : ''}`}
                            onClick={() => setHora(h)}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PASO 4: DATOS PACIENTE */}
            <div className="card shadow-sm booking-card">
              <div className="card-header booking-card-header">
                <h5 className="mb-0">4. Tus datos</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
                    <label className="form-label">Teléfono *</label>
                    <input
                      type="tel"
                      className={`form-control ${formErrors.telefonoPaciente ? 'is-invalid' : ''}`}
                      value={form.telefonoPaciente}
                      onChange={e => setForm({...form, telefonoPaciente: e.target.value})}
                      placeholder="+56 9 1234 5678"
                    />
                    {formErrors.telefonoPaciente && <div className="invalid-feedback">{formErrors.telefonoPaciente}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Motivo de consulta</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.motivo}
                      onChange={e => setForm({...form, motivo: e.target.value})}
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="col-lg-4">
            <div className="summary-card shadow-sm">
              <h5 className="summary-title">Resumen de tu reserva</h5>
              <div className="summary-row">
                <span>Profesional</span>
                <strong>{profesional?.nombre}</strong>
              </div>
              <div className="summary-row">
                <span>Sesión</span>
                <strong className={sesionSeleccionada ? '' : 'text-muted'}>{sesionSeleccionada ? sesionSeleccionada.label : 'Sin elegir'}</strong>
              </div>
              <div className="summary-row">
                <span>Fecha</span>
                <strong>{fecha ? new Date(fecha+'T12:00:00').toLocaleDateString('es-CL',{day:'numeric',month:'short'}) : '—'}</strong>
              </div>
              <div className="summary-row">
                <span>Hora</span>
                <strong className={hora ? '' : 'text-muted'}>{hora || 'Sin elegir'}</strong>
              </div>
              <hr />
              <div className="summary-row summary-total">
                <span>Total</span>
                <strong>{sesionSeleccionada ? formatCLP(sesionSeleccionada.price) : '—'}</strong>
              </div>
              <button
                type="submit"
                className="btn w-100 text-white fw-bold mt-3"
                style={{backgroundColor:'#4a6fa5'}}
                disabled={enviando || !hora || !sesionSeleccionada}
              >
                {enviando ? 'Reservando...' : 'Confirmar Reserva'}
              </button>
              {(!sesionSeleccionada || !hora) && (
                <p className="summary-hint">Elige tu sesión y un horario para poder confirmar</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalDetail;
