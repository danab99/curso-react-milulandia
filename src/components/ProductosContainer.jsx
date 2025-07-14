import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ShoppingBag, AlertCircle, Loader2, Plus, Check, ShoppingCart } from "lucide-react";
import { useProductosContext } from "../contexts/ProductosContext";
import { useCarrito } from "../contexts/CarritoContext";
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert, Badge, Toast, ToastContainer } from 'react-bootstrap';


const CardProducto = ({ producto }) => {
  const { 
    agregarAlCarrito, 
    estaEnCarrito, 
    obtenerCantidadProducto 
  } = useCarrito();
  
  const [agregando, setAgregando] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const productoEnCarrito = estaEnCarrito(producto.id);
  const cantidadEnCarrito = obtenerCantidadProducto(producto.id);

  const manejarAgregarCarrito = async () => {
    try {
      setAgregando(true);
      
      const productoParaCarrito = {
        id: producto.id,
        name: producto.name,
        price: parseFloat(producto.price),
        imagen: producto.image || "https://i.imgur.com/pzkDD1I.jpeg",
        description: producto.description || "Sin descripción disponible",
        categoria: producto.category,
        cantidad: cantidad
      };

      await agregarAlCarrito(productoParaCarrito);
      setMostrarToast(true);
      
      setCantidad(1);
      
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setAgregando(false);
    }
  };

  return (
    <>
      <Card className="h-100 shadow-sm border-0" style={{ transition: 'all 0.3s ease' }}>
        <div className="position-relative overflow-hidden">
          <Card.Img 
            variant="top" 
            src={producto.image || "https://i.imgur.com/pzkDD1I.jpeg"} 
            alt={producto.name}
            style={{ 
              height: '200px', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={(e) => {
              e.target.src = "https://i.imgur.com/pzkDD1I.jpeg";
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* Badge de categoría */}
          {producto.category && (
            <span 
              className="badge bg-light text-dark position-absolute top-0 end-0 m-2"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              {producto.category}
            </span>
          )}

          {/* Badge de "En carrito" */}
          {productoEnCarrito && (
            <span 
              className="badge bg-success position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Check size={12} />
              En carrito ({cantidadEnCarrito})
            </span>
          )}
        </div>
        
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold text-dark mb-2" style={{ 
            fontSize: '1.1rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {producto.name}
          </Card.Title>
          
          <Card.Text className="text-muted small mb-3 flex-grow-1" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {producto.description || "Sin descripción disponible"}
          </Card.Text>
          
          <div className="mt-auto">
            {/* Precio */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="h4 text-primary fw-bold mb-0">
                ${parseFloat(producto.price).toFixed(2)}
              </span>
              {productoEnCarrito && (
                <Badge bg="success" className="d-flex align-items-center gap-1">
                  <ShoppingCart size={12} />
                  {cantidadEnCarrito}
                </Badge>
              )}
            </div>

            {/* Controles de cantidad y botón */}
            <div className="d-flex gap-2 align-items-center">
              <div className="d-flex align-items-center border rounded">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                  className="border-0"
                >
                  -
                </Button>
                <span className="px-3 py-1 border-start border-end">{cantidad}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setCantidad(cantidad + 1)}
                  className="border-0"
                >
                  +
                </Button>
              </div>

              <Button 
                variant={productoEnCarrito ? "success" : "primary"}
                size="sm"
                className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                onClick={manejarAgregarCarrito}
                disabled={agregando}
              >
                {agregando ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Agregando...
                  </>
                ) : productoEnCarrito ? (
                  <>
                    <Plus size={16} />
                    Agregar más
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Agregar
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Toast de confirmación */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast 
          show={mostrarToast} 
          onClose={() => setMostrarToast(false)}
          delay={3000}
          autohide
          bg="success"
          className="text-white"
        >
          <Toast.Header closeButton={false}>
            <Check size={16} className="me-2" />
            <strong className="me-auto">¡Agregado al carrito!</strong>
          </Toast.Header>
          <Toast.Body>
            <strong>{producto.name}</strong> se agregó correctamente al carrito.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

const Paginacion = ({ paginaActual, totalPaginas, cambiarPagina }) => {
  const obtenerPaginasVisibles = () => {
    const delta = 2;
    const inicio = Math.max(1, paginaActual - delta);
    const fin = Math.min(totalPaginas, paginaActual + delta);
    
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  };

  const paginasVisibles = obtenerPaginasVisibles();

  if (totalPaginas <= 1) return null;

  return (
    <nav aria-label="Navegación de productos" className="d-flex justify-content-center mt-4">
      <ul className="pagination pagination-lg">
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link d-flex align-items-center gap-2"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <ChevronLeft size={16} />
            Anterior
          </button>
        </li>

        {paginaActual > 3 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => cambiarPagina(1)}>
                1
              </button>
            </li>
            {paginaActual > 4 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {paginasVisibles.map((pagina) => (
          <li key={pagina} className={`page-item ${paginaActual === pagina ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => cambiarPagina(pagina)}
            >
              {pagina}
            </button>
          </li>
        ))}

        {paginaActual < totalPaginas - 2 && (
          <>
            {paginaActual < totalPaginas - 3 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => cambiarPagina(totalPaginas)}>
                {totalPaginas}
              </button>
            </li>
          </>
        )}

        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button
            className="page-link d-flex align-items-center gap-2"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Componente principal 
function ProductosContainer() {
  const { productos, obtenerProductos, filtrarProductos } = useProductosContext();
  const { obtenerCantidadTotal } = useCarrito();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 8;
  const cantidadTotalCarrito = obtenerCantidadTotal();

  // Cargar productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError(null);
        await obtenerProductos();
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError('Hubo un problema al cargar los productos. Por favor, intenta de nuevo.');
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    filtrarProductos(filtro);
    setPaginaActual(1); // Resetear página al filtrar
  }, [filtro, filtrarProductos]);

  // Calcular productos de la página actual
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosActuales = productos.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reintentar = () => {
    setCargando(true);
    setError(null);
    obtenerProductos()
      .then(() => setCargando(false))
      .catch((error) => {
        console.error('Error al reintentar:', error);
        setError('Hubo un problema al cargar los productos. Por favor, intenta de nuevo.');
        setCargando(false);
      });
  };

  if (cargando) {
    return (
      <Container className="py-5">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted fs-5">Cargando productos...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <AlertCircle className="me-2" size={24} />
          <div>
            <h5>Error al cargar productos</h5>
            <p className="mb-3">{error}</p>
            <Button variant="danger" onClick={reintentar}>
              Reintentar
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header con información del carrito */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h1 className="display-6 fw-bold text-dark mb-0">Nuestros Productos</h1>
          {cantidadTotalCarrito > 0 && (
            <div className="d-flex align-items-center gap-2">
              <Badge bg="primary" className="fs-6 d-flex align-items-center gap-1">
                <ShoppingCart size={16} />
                {cantidadTotalCarrito} {cantidadTotalCarrito === 1 ? 'producto' : 'productos'} en el carrito
              </Badge>
            </div>
          )}
        </div>
        <p className="text-muted lead">Explora nuestra variedad de productos de alta calidad</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <InputGroup size="lg">
          <InputGroup.Text>
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar productos por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ fontSize: '1rem' }}
          />
        </InputGroup>
      </div>

      {/* Información de resultados */}
      <div className="mb-4">
        <p className="text-muted">
          {filtro ? (
            <>
              Mostrando <strong>{productos.length}</strong> resultado{productos.length !== 1 ? 's' : ''} para "
              <strong>{filtro}</strong>"
            </>
          ) : (
            <>Mostrando <strong>{productos.length}</strong> productos</>
          )}
        </p>
      </div>

      {/* Grid de productos */}
      {productosActuales.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} xl={4} className="g-4 mb-4">
            {productosActuales.map((producto) => (
              <Col key={producto.id}>
                <CardProducto producto={producto} />
              </Col>
            ))}
          </Row>

          {/* Paginación */}
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            cambiarPagina={cambiarPagina}
          />
        </>
      ) : (
        <div className="text-center py-5">
          <ShoppingBag size={64} className="text-muted mb-3" style={{ opacity: 0.5 }} />
          <h4 className="text-muted">No se encontraron productos</h4>
          {filtro && (
            <Button 
              variant="primary" 
              className="mt-3"
              onClick={() => setFiltro("")}
            >
              Limpiar filtro
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}

export default ProductosContainer;