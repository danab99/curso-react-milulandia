import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlus,
  FaShoppingCart,
  FaUsers,
  FaBars,
  FaTimes
} from "react-icons/fa";
import "../styles/Admin/AdminMenu.css";

// 👉 Importa aquí tus componentes separados (cuando los crees)
import Dashboard from "./admin/DashboardAdmin.jsx";
import GestionProductos from "./admin/GestionProductos.jsx";
import AgregarProducto from "./admin/AgregarProducto";
// import GestionPedidos from "./GestionPedidos";
// import GestionUsuarios from "./GestionUsuarios";

export default function Admin() {
  const { admin } = useAuthContext();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'productos', label: 'Gestionar Productos', icon: FaBoxOpen },
    { id: 'agregar', label: 'Agregar Producto', icon: FaPlus }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <GestionProductos />;
      case 'agregar':
        return <AgregarProducto />;
    //   case 'pedidos':
    //     return <GestionPedidos />;
    //   case 'usuarios':
    //     return <GestionUsuarios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="sidebar-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>Panel de Administración</h1>
        </div>

        <div className="admin-body">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}
