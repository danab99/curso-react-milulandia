import React, { createContext, useState, useContext, useEffect } from 'react';
import { observarAuth, obtenerUsuarioActual, cerrarSesion } from '../auth/firebase';

export const AuthContext = createContext();

// Lista de emails de administradores
const ADMIN_EMAILS = [
  'admin@gmail.com',
  'admin@ecommerce.com'
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para verificar si un email es de administrador
  const isAdmin = (email) => {
    return ADMIN_EMAILS.includes(email?.toLowerCase());
  };

  // Función de login que maneja tanto Firebase como el estado local
  const login = (userCredential) => {
    const userEmail = userCredential.email;
    const adminStatus = isAdmin(userEmail);
    
    setUser(userCredential);
    setAdmin(adminStatus);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('isAdmin', adminStatus.toString());
    
    console.log(`Usuario logueado: ${userEmail}, Admin: ${adminStatus}`);
  };

  const logout = async () => {
    try {
      await cerrarSesion();
      setUser(null);
      setAdmin(false);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  const verificarSesion = () => {
    const currentUser = obtenerUsuarioActual();
    if (currentUser) {
      const adminStatus = isAdmin(currentUser.email);
      setUser(currentUser);
      setAdmin(adminStatus);
    } else {
      // Limpiar datos si no hay usuario
      setUser(null);
      setAdmin(false);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
    }
    setLoading(false);
  };

  // Efecto para observar cambios en la autenticación de Firebase
  useEffect(() => {
    const unsubscribe = observarAuth((user) => {
      if (user) {
        const adminStatus = isAdmin(user.email);
        setUser(user);
        setAdmin(adminStatus);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('isAdmin', adminStatus.toString());
      } else {
        setUser(null);
        setAdmin(false);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAdmin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    admin,
    loading,
    login,
    logout,
    verificarSesion,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};