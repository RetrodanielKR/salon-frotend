import React, { useState } from 'react';
import axiosInstance from '../api/Axiosconfig';
import './Register.css';

interface RegisterFormData {
  nombre: string;
  telefono: string;
  correo: string;
  contraseña: string;
  confirmarContraseña: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    telefono: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contraseña !== formData.confirmarContraseña) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axiosInstance.post('/usuarios', {
        nombre: formData.nombre,
        telefono: formData.telefono,
        correo: formData.correo,
        contraseña: formData.contraseña,
      });
      
      console.log('Response from backend:', response.data);
      setShowMessage(true);
      setTimeout(() => {
        // Redirigir o hacer algo después del registro exitoso
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Error al registrar usuario. Por favor, intenta nuevamente.');
    }
  };

  const isFormValid = () => {
    const { nombre, telefono, correo, contraseña, confirmarContraseña } = formData;
    return nombre && telefono && correo && contraseña && confirmarContraseña;
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        {showMessage && (
          <div className="success-message">
            <p>Registro exitoso. Ahora puedes iniciar sesión.</p>
          </div>
        )}
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
        <div>
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            name="confirmarContraseña"
            value={formData.confirmarContraseña}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={!isFormValid()}>Registrarse</button>
      </form>
      <div className="register-link">
          <p>¿Ya tienes cuenta? <a href="/">Iniciar sesión</a></p>
        </div>
    </div>
  );
};

export default Register;
