import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, Dropdown } from "react-bootstrap";
import { CarritoContext } from "../../contexts/CarritoContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { AuthenticatedContent, AdminContent, GuestContent } from '../ProtectedRoute';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "../../styles/NavbarEcommerce.css";

function NavBoostrap() {
  const { productosCarrito } = useContext(CarritoContext);
  const { admin, user, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Navbar className="navbar-ecommerce" expand="lg" sticky="top">
      <Container>
        {/* Logo y Brand */}
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <span className="brand-text">Milulandia</span>
          <span className="brand-tagline">Tu tienda de confianza</span>
        </Navbar.Brand>

        {/* Toggle para móvil */}
        <button 
          className="mobile-toggle d-lg-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú principal */}
        <Navbar.Collapse id="nav-principal" className={isMenuOpen ? 'show' : ''}>
          <Nav className="me-auto main-nav">
            <Nav.Link as={Link} to="/" className="nav-item">
              Inicio
            </Nav.Link>
            
            <Nav.Link as={Link} to="/productos" className="nav-item">
              Productos
            </Nav.Link>

            <Nav.Link as={Link} to="/nosotros" className="nav-item">
              Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto" className="nav-item">
              Contacto
            </Nav.Link>
            
            {/* Menú Admin - Solo para administradores */}
            <AdminContent>
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle as={Nav.Link} className="nav-item admin-link">
                  Admin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/admin">Dashboard</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/productos">Gestionar Productos</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/agregar-productos">Agregar Productos</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/pedidos">Gestionar Pedidos</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/usuarios">Usuarios</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </AdminContent>
          </Nav>

          {/* Acciones del usuario - Desktop y Mobile */}
          <Nav className="user-actions">
            {/* Carrito - Solo para usuarios autenticados */}
            <AuthenticatedContent>
              <Nav.Link as={Link} to="/carrito" className="action-btn cart-btn">
                <FaShoppingCart />
                <span className="d-none d-lg-inline">Carrito</span>
                {productosCarrito.length > 0 && (
                  <Badge bg="danger" className="cart-badge">
                    {productosCarrito.length}
                  </Badge>
                )}
              </Nav.Link>
            </AuthenticatedContent>

            {/* Dropdown de usuario autenticado */}
            <AuthenticatedContent>
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="user-dropdown">
                  <FaUser />
                  <span className="d-none d-lg-inline">
                    {user?.name || user?.email || 'Usuario'}
                  </span>
                  {admin && (
                    <Badge bg="warning" className="ms-1 admin-badge">
                      Admin
                    </Badge>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/perfil">Mi Perfil</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/pedidos">Mis Pedidos</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/carrito">Mi Carrito</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/configuracion">Configuración</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </AuthenticatedContent>

            {/* Botón de login - Solo para usuarios no autenticados */}
            <GuestContent>
              <Nav.Link as={Link} to="/login" className="action-btn">
                <FaUser />
                <span className="d-none d-lg-inline">Ingresar</span>
              </Nav.Link>
            </GuestContent>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBoostrap;