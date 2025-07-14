import { useEffect, useState, useCallback } from "react";
import { useProductosContext } from "../../contexts/ProductosContext";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { mostrarDetalleProducto } from "../../utils/SweetDetalleProducto"
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/GestionProductos.css";

export default function GestionProductos() {
  const navigate = useNavigate();
  const { productos, obtenerProductos } = useProductosContext();
  //const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        await obtenerProductos();
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError('Hubo un problema al cargar los productos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const formatearPrecio = (precio) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(precio);

  const formatearFecha = (timestamp) => {
    if (!timestamp) return "N/A";
    const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return fecha.toLocaleDateString("es-AR");
  };

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleVer = (producto) => {
    mostrarDetalleProducto(producto);
  };

  const handleEditar = (producto) => {
    navigate(`/admin/editarProducto/${producto.id}`);
  };

  const handleEliminar = async (producto) => {
    const { isConfirmed } = await Swal.fire({
      title: `¿Estás seguro de eliminar "${producto.name}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      try {
        await eliminarProducto(producto.id);
        setProductos((prev) => prev.filter((p) => p.id !== producto.id));
        Swal.fire({
          title: "¡Eliminado!",
          text: `Producto "${producto.name}" eliminado correctamente.`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.error("Error eliminando producto:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el producto. Intenta de nuevo.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };


  if (loading)
    return (
      <div className="admin-content">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="admin-content">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={cargarProductos} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="admin-content">
      <div className="content-header">
        <h2>Gestionar Productos</h2>
      </div>

      <div className="filters-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="stats">
          <span>Total: {productosFiltrados.length} productos</span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className={`sortable ${sortConfig.key === "name" ? sortConfig.direction : ""
                  }`}
              >
                Nombre
              </th>
              <th
                onClick={() => handleSort("price")}
                className={`sortable ${sortConfig.key === "price" ? sortConfig.direction : ""
                  }`}
              >
                Precio
              </th>
              <th>Descripción</th>
              <th
                onClick={() => handleSort("createdAt")}
                className={`sortable ${sortConfig.key === "createdAt" ? sortConfig.direction : ""
                  }`}
              >
                Fecha Creación
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosOrdenados.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm
                    ? "No se encontraron productos que coincidan con tu búsqueda."
                    : "No hay productos disponibles."}
                </td>
              </tr>
            ) : (
              productosOrdenados.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="product-name">
                      <strong>{producto.name}</strong>
                      <small>ID: {producto.id}</small>
                    </div>
                  </td>
                  <td className="price-cell">{formatearPrecio(producto.price)}</td>
                  <td>
                    <div className="description-cell">
                      {producto.description ? (
                        producto.description.length > 50
                          ? `${producto.description.substring(0, 50)}...`
                          : producto.description
                      ) : (
                        <span className="no-description">Sin descripción</span>
                      )}
                    </div>
                  </td>
                  <td>{formatearFecha(producto.createdAt)}</td>
                  <td>
                    <div className="actions-container">
                      <button
                        className="btn-action btn-view"
                        onClick={() => handleVer(producto)}
                        title="Ver producto"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEditar(producto)}
                        title="Editar producto"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleEliminar(producto)}
                        title="Eliminar producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
