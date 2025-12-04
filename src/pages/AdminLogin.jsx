// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import apiClient from '../api/api_client';

const AdminLoginPage = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/admin/login', { username, password });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Fallo de autenticación admin:', err);
      alert('Acceso denegado. Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>🔒 Acceso de Auditoría — SmartCargo</h2>
      <p>Solo personal autorizado. SmartCargo es asesoría, no certificación.</p>

      <input type="text" placeholder="Usuario (ADMIN_USERNAME)" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña (ADMIN_PASSWORD)" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Autenticando...' : 'Acceder'}
      </button>

      <footer style={{ marginTop: 18 }}>
        <small>Nota legal: acceso restringido. Sus acciones quedan registradas para auditoría.</small>
      </footer>
    </div>
  );
};

export default AdminLoginPage;
