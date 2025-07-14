import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { crearUsuario, loginEmailPass, logearConGoogle } from '../../auth/firebase';
import { dispararSweetBasico } from '../../utils/SweetAlert';
import '../../styles/LoginStyle.css'

function LoginBoost2() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login, user, logout, admin, loading } = useAuthContext();
  const navigate = useNavigate();

  // Función para manejar el login con email y contraseña
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await loginEmailPass(email, password);
      login(userCredential);
      dispararSweetBasico("Login exitoso", `Bienvenido ${userCredential.email}`, "success", "Confirmar");
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      if (error.code === "auth/invalid-credential") {
        dispararSweetBasico("Error de login", "Credenciales incorrectas", "error", "Cerrar");
      } else if (error.code === "auth/user-not-found") {
        dispararSweetBasico("Error de login", "Usuario no encontrado", "error", "Cerrar");
      } else if (error.code === "auth/wrong-password") {
        dispararSweetBasico("Error de login", "Contraseña incorrecta", "error", "Cerrar");
      } else {
        dispararSweetBasico("Error de login", "Error inesperado. Intenta nuevamente.", "error", "Cerrar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await crearUsuario(email, password);
      login(userCredential);
      dispararSweetBasico("Registro exitoso", `Cuenta creada para ${userCredential.email}`, "success", "Confirmar");
      navigate('/');
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.code === "auth/email-already-in-use") {
        dispararSweetBasico("Error de registro", "Este email ya está registrado", "error", "Cerrar");
      } else if (error.code === "auth/weak-password") {
        dispararSweetBasico("Error de registro", "La contraseña debe tener al menos 6 caracteres", "error", "Cerrar");
      } else if (error.code === "auth/invalid-email") {
        dispararSweetBasico("Error de registro", "Email inválido", "error", "Cerrar");
      } else {
        dispararSweetBasico("Error de registro", "Error inesperado. Intenta nuevamente.", "error", "Cerrar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar login con Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await logearConGoogle();
      login(result.user);
      dispararSweetBasico("Login exitoso", `Bienvenido ${result.user.email}`, "success", "Confirmar");
      navigate('/');
    } catch (error) {
      console.error('Error en login con Google:', error);
      dispararSweetBasico("Error de login", "Error al iniciar sesión con Google", "error", "Cerrar");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    await logout();
    dispararSweetBasico("Sesión cerrada", "Has cerrado sesión exitosamente", "info", "Confirmar");
    navigate('/');
  };

  // Función para alternar entre login y registro
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
  };

  // Mostrar loading si está cargando
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si el usuario ya está logueado, mostrar opción de logout
  if (user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h4 className="text-center mb-3">
            {admin ? '🔐 Panel de Administrador' : '👤 Usuario'}
          </h4>
          <p className="text-center mb-3">
            Bienvenido: <strong>{user.email}</strong>
          </p>
          {admin && (
            <div className="alert alert-info text-center mb-3">
              <small>Tienes permisos de administrador</small>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-danger w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    );
  }

  // Formulario de login/registro
  return (
    <div className="login-container">
      <div className="login-card">
        <h3 className="text-center mb-4">
          {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
        </h3>

        <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ?
              (isLoginMode ? 'Iniciando sesión...' : 'Registrando...') :
              (isLoginMode ? 'Iniciar Sesión' : 'Registrarse')
            }
          </button>
        </form>

        {/* Botón de Google solo para login */}
        {isLoginMode && (
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline-danger w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? 'Conectando...' : '🔍 Continuar con Google'}
          </button>
        )}

        {/* Botón para alternar entre login y registro */}
        <div className="text-center">
          <small className="text-muted">
            {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </small>
          <button
            type="button"
            className="btn btn-link p-0 ms-2"
            onClick={toggleMode}
            disabled={isLoading}
          >
            {isLoginMode ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>

        {/* Información para testing */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Para testing:</strong><br />
            Admin: admin@gmail.com<br />
            Usuario (NO ADMIN): usuario@gmail.com
            Password: test123
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginBoost2;
