import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfessionals, fetchProfessionalSchedule, updateProfessionalSchedule } from '../services/api';

const DIAS = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const diaVacio = () => ({ activo: false, inicio: '09:00', fin: '18:00', pausaInicio: '', pausaFin: '' });

const horarioVacio = () => {
  const h = {};
  DIAS.forEach(d => { h[d.key] = diaVacio(); });
  return h;
};

const AdminSchedules = ({ token }) => {
  const [profesionales, setProfesionales] = useState([]);
  const [profesionalId, setProfesionalId] = useState('');
  const [horarioSemanal, setHorarioSemanal] = useState(horarioVacio());
  const [duracionSesionMin, setDuracionSesionMin] = useState(60);
  const [fechasBloqueadas, setFechasBloqueadas] = useState([]);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getProfessionals()
      .then(data => {
        setProfesionales(data);
        if (data.length > 0) setProfesionalId(String(data[0].id));
      })
      .catch(() => toast.error('Error al cargar la lista de profesionales'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!profesionalId) return;
    setLoading(true);
    fetchProfessionalSchedule(profesionalId, token)
      .then(data => {
        const base = horarioVacio();
        if (data.horarioSemanal) {
          DIAS.forEach(d => {
            if (data.horarioSemanal[d.key]) {
              base[d.key] = { ...diaVacio(), ...data.horarioSemanal[d.key] };
            }
          });
        }
        setHorarioSemanal(base);
        setDuracionSesionMin(data.duracionSesionMin || 60);
        setFechasBloqueadas(data.fechasBloqueadas || []);
      })
      .catch(err => {
        toast.error('Error al cargar horario: ' + err.message);
        if (err.message.includes('401') || err.message.includes('403')) {
          // el token vencio, nada que hacer aca ademas de avisar
        }
      })
      .finally(() => setLoading(false));
  }, [profesionalId, token]);

  const actualizarDia = (dia, campo, valor) => {
    setHorarioSemanal(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [campo]: valor }
    }));
  };

  const agregarFechaBloqueada = () => {
    if (!nuevaFecha) { toast.error('Elige una fecha'); return; }
    if (fechasBloqueadas.some(f => f.fecha === nuevaFecha)) { toast.error('Esa fecha ya esta bloqueada'); return; }
    setFechasBloqueadas(prev => [...prev, { fecha: nuevaFecha, motivo: nuevoMotivo || 'Sin especificar' }].sort((a, b) => a.fecha.localeCompare(b.fecha)));
    setNuevaFecha('');
    setNuevoMotivo('');
  };

  const quitarFechaBloqueada = (fecha) => {
    setFechasBloqueadas(prev => prev.filter(f => f.fecha !== fecha));
  };

  const guardar = async () => {
    // Validacion rapida en el front antes de mandar al backend
    for (const d of DIAS) {
      const dia = horarioSemanal[d.key];
      if (dia.activo && dia.inicio >= dia.fin) {
        toast.error(`En ${d.label}: la hora de inicio debe ser antes que la de fin`);
        return;
      }
      if (dia.activo && dia.pausaInicio && dia.pausaFin && dia.pausaInicio >= dia.pausaFin) {
        toast.error(`En ${d.label}: la pausa debe empezar antes de terminar`);
        return;
      }
    }
    setGuardando(true);
    try {
      // Limpiar pausas vacias antes de enviar
      const horarioLimpio = {};
      DIAS.forEach(d => {
        const dia = horarioSemanal[d.key];
        horarioLimpio[d.key] = {
          activo: dia.activo,
          inicio: dia.inicio,
          fin: dia.fin,
          pausaInicio: dia.pausaInicio || null,
          pausaFin: dia.pausaFin || null,
        };
      });
      await updateProfessionalSchedule(profesionalId, {
        horarioSemanal: horarioLimpio,
        duracionSesionMin: Number(duracionSesionMin),
        fechasBloqueadas
      }, token);
      toast.success('Horario guardado correctamente');
    } catch (err) {
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <div className="mb-4" style={{ maxWidth: 360 }}>
        <label className="form-label fw-bold">Profesional</label>
        <select
          className="form-select"
          value={profesionalId}
          onChange={e => setProfesionalId(e.target.value)}
        >
          {profesionales.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header text-white" style={{ backgroundColor: '#4a6fa5' }}>
              <h6 className="mb-0">Horario semanal</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Atiende</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Pausa (opcional)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DIAS.map(d => {
                      const dia = horarioSemanal[d.key];
                      return (
                        <tr key={d.key} className={!dia.activo ? 'text-muted' : ''}>
                          <td className="fw-semibold">{d.label}</td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={dia.activo}
                                onChange={e => actualizarDia(d.key, 'activo', e.target.checked)}
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              type="time"
                              className="form-control form-control-sm"
                              style={{ width: 110 }}
                              value={dia.inicio}
                              disabled={!dia.activo}
                              onChange={e => actualizarDia(d.key, 'inicio', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              className="form-control form-control-sm"
                              style={{ width: 110 }}
                              value={dia.fin}
                              disabled={!dia.activo}
                              onChange={e => actualizarDia(d.key, 'fin', e.target.value)}
                            />
                          </td>
                          <td>
                            <div className="d-flex gap-1 align-items-center">
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                style={{ width: 110 }}
                                value={dia.pausaInicio}
                                disabled={!dia.activo}
                                onChange={e => actualizarDia(d.key, 'pausaInicio', e.target.value)}
                                placeholder="Desde"
                              />
                              <span>-</span>
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                style={{ width: 110 }}
                                value={dia.pausaFin}
                                disabled={!dia.activo}
                                onChange={e => actualizarDia(d.key, 'pausaFin', e.target.value)}
                                placeholder="Hasta"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="small text-muted mt-2 mb-0">
                Nota: la última hora reservable es la última que alcanza a completarse antes de "Fin".
                Ej: si termina a las 18:00 y las sesiones duran 60 min, la última hora que se puede reservar es 17:00.
              </p>

              <div className="mt-3" style={{ maxWidth: 220 }}>
                <label className="form-label fw-bold">Duración de cada sesión (minutos)</label>
                <input
                  type="number"
                  className="form-control"
                  min={10}
                  max={240}
                  step={5}
                  value={duracionSesionMin}
                  onChange={e => setDuracionSesionMin(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header text-white" style={{ backgroundColor: '#4a6fa5' }}>
              <h6 className="mb-0">Días bloqueados (vacaciones, permisos, etc.)</h6>
            </div>
            <div className="card-body">
              {fechasBloqueadas.length === 0 ? (
                <p className="text-muted mb-3">No hay fechas bloqueadas.</p>
              ) : (
                <ul className="list-group mb-3">
                  {fechasBloqueadas.map(f => (
                    <li key={f.fecha} className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>{f.fecha}</strong> — {f.motivo}</span>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => quitarFechaBloqueada(f.fecha)}>
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="row g-2 align-items-end">
                <div className="col-auto">
                  <label className="form-label small mb-1">Fecha</label>
                  <input type="date" className="form-control form-control-sm" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} />
                </div>
                <div className="col">
                  <label className="form-label small mb-1">Motivo (opcional)</label>
                  <input type="text" className="form-control form-control-sm" placeholder="Vacaciones, permiso, etc." value={nuevoMotivo} onChange={e => setNuevoMotivo(e.target.value)} />
                </div>
                <div className="col-auto">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={agregarFechaBloqueada}>
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn text-white fw-bold px-4"
            style={{ backgroundColor: '#4a6fa5' }}
            disabled={guardando}
            onClick={guardar}
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </>
      )}
    </div>
  );
};

export default AdminSchedules;
