import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

// Componente para proteger rutas
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, admin, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando acceso...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !admin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>🚫 Acceso Denegado</h4>
          <p>No tienes permisos de administrador para acceder a esta página.</p>
          <a href="/" className="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    );
  }

  return children;
}

// Componente para mostrar contenido solo a usuarios autenticados
export function AuthenticatedContent({ children, fallback = null }) {
  const { user, loading } = useAuthContext();

  if (loading) return null;
  return user ? children : fallback;
}

// Componente para mostrar contenido solo a administradores
export function AdminContent({ children, fallback = null }) {
  const { admin, loading } = useAuthContext();

  if (loading) return null;
  return admin ? children : fallback;
}

// Componente para mostrar contenido solo a usuarios no autenticados
export function GuestContent({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return null;
  return !user ? children : null;
}