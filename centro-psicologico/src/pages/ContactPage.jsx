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
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Correo electronico invalido';
    }
    if (!form.telefono.trim()) {
      errs.telefono = 'El telefono es obligatorio';
        } else if (!/^[+]?[\d\s()-]{7,15}$/.test(form.telefono)) {
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