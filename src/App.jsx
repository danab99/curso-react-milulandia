import { useEffect, useState } from 'react'
import './App.css'
import Home from './layouts/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductosContainer from './components/ProductosContainer';
import About from './components/general/About';
import Contacto from './components/general/Contacto';
import Admin from './components/Admin';
import EditarProducto from './components/admin/EditarProducto';
import { useAuthContext } from './contexts/AuthContext';
import NavBoostrap from './components/general/NavBoostrap';
import CarritoBootstrap from './components/CarritoBootstrap';
import LoginBoost2 from './components/general/LoginUser';
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const { loading } = useAuthContext();

  // Mostrar loading mientras se verifica la autenticación inicial
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando aplicación...</span>
          </div>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <div>
        <NavBoostrap/>
        <Routes>
          {/* Rutas públicas - accesibles para todos */}
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<LoginBoost2/>} />
          <Route path="/productos" element={<ProductosContainer/>}/>
          {/* <Route path="/productos/:id" element={<ProductoDetalleBoostrap/>}/> */}
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contacto/>} />
          
          {/* Rutas protegidas - requieren autenticación */}
          <Route 
            path="/carrito" 
            element={
              <ProtectedRoute>
                <CarritoBootstrap />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas de administrador - requieren permisos de admin */}
          <Route 
            path='/admin' 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin/>
              </ProtectedRoute>
            }
          />
          
          {/* <Route 
            path="/admin/agregarProductos" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <FormularioProducto/>
              </ProtectedRoute>
            }
          /> */}
          
          <Route 
            path="/admin/editarProducto/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditarProducto/>
              </ProtectedRoute>
            }
          />
          
          {/* Ruta 404 - opcional */}
          <Route 
            path="*" 
            element={
              <div className="container mt-5">
                <div className="row justify-content-center">
                  <div className="col-md-6 text-center">
                    <h1 className="display-1">404</h1>
                    <h2>Página no encontrada</h2>
                    <p className="text-muted">La página que buscas no existe.</p>
                    <a href="/" className="btn btn-primary">Volver al inicio</a>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App;