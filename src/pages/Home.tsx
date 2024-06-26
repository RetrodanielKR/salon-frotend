import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const response = await axios.post('http://localhost:9000/api/usuarios/login', {
            correo,
            contraseña
        });
        if (response.status === 200) {
            const { user } = response.data;
            localStorage.setItem('user', JSON.stringify(user)); // Guardar los datos del usuario
            navigate('/schedule');
        }
    } catch (err) {
        setError('Correo o contraseña incorrectos');
        console.error('Error durante el inicio de sesión:', err);
    }
};



  return (
    <div>
      <h1>Bienvenidos al Salón De Belleza</h1>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="register-link">
        <p>¿No tienes cuenta? <a href="/Register">Registrarse</a></p>
      </div>
    </div>
  );
};

export default Home;
