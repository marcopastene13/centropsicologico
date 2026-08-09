import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReservas, actualizarEstadoReserva, eliminarReserva } from '../services/api';
import AdminSchedules from './AdminSchedules';
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
  const [tab, setTab] = useState('reservas');

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
      r.profesional?.nombre?.toLowerCase().includes(busqueda.toLowerCase());
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

      {/* Pestanas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'reservas' ? 'active' : ''}`} onClick={() => setTab('reservas')}>
            Reservas
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'horarios' ? 'active' : ''}`} onClick={() => setTab('horarios')}>
            Horarios
          </button>
        </li>
      </ul>

      {tab === 'horarios' ? (
        <AdminSchedules token={token} />
      ) : (
        <>
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
                <th>Sesión</th>
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
                  <td>{r.profesional?.nombre || '-'}<br/><small className="text-muted">{r.profesional?.especialidad}</small></td>
                  <td><small>{r.servicio || '-'}</small></td>
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
        </>
      )}
    </div>
  );
};

export default AdminEditPanel;