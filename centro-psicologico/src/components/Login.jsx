import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(API_URL + '/auth/login', { email, password });
      onLogin(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4" style={{color: '#4a6fa5'}}>Panel Administrativo</h3>
              <p className="text-center text-muted mb-4">Centro Psicologico Centenario</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo electronico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@centropsicologico.cl"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contrasena</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="********"
                  />
                </div>
                <button type="submit" className="btn w-100 text-white" style={{backgroundColor:'#4a6fa5'}} disabled={loading}>
                  {loading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
