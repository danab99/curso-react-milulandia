import "../../styles/Admin/AgregarProducto.css";
import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { dispararSweetBasico } from "../../utils/SweetAlert";
import { obtenerProductoPorId, actualizarProducto } from "../../utils/requests";
import { useAuthContext } from "../../contexts/AuthContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";

function EditarProducto() {
  const { admin } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    imagen: "",
  });

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await obtenerProductoPorId(id);
        setProducto(data);
      } catch (error) {
        dispararSweetBasico(
          "Error",
          "No se pudo cargar el producto.",
          "error",
          "Cerrar"
        );
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id, navigate]);

  const validarCampo = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "El nombre es obligatorio.";
        break;
      case "price":
        if (!value || Number(value) <= 0) error = "El precio debe ser mayor a 0.";
        break;
      case "description":
        if (!value.trim() || value.length < 10) error = "Debe tener al menos 10 caracteres.";
        break;
      case "imagen":
        if (!value.trim()) error = "La URL no debe estar vacía.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validarCampo(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validarCampo("name", producto.name),
      price: validarCampo("price", producto.price),
      description: validarCampo("description", producto.description),
      imagen: validarCampo("imagen", producto.imagen),
    };

    setErrors(newErrors);

    const hayErrores = Object.values(newErrors).some((error) => error !== "");

    if (hayErrores) {
      dispararSweetBasico("Error", "Revisa los campos del formulario.", "error", "Cerrar");
      return;
    }

    try {
      await actualizarProducto(id, producto);
      dispararSweetBasico("Actualizado", "Producto editado correctamente.", "success", "Cerrar");
      navigate("/admin");
    } catch (error) {
      dispararSweetBasico("Error", error.message || error, "error", "Cerrar");
    }
  };

  if (!admin) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <section className="agregar-producto-section">
      <div className="agregar-producto-header">
        <h2 className="agregar-producto-title">Editar Producto</h2>
        <p className="agregar-producto-subtitle">Modifica los datos del producto</p>
      </div>

      <div className="agregar-producto-card">
        <div className="agregar-producto-icon">
          <i className="fas fa-edit"></i>
        </div>

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre del producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              name="name"
              value={producto.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="imagen">
            <Form.Label>URL de la Imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese URL de la imagen"
              name="imagen"
              value={producto.imagen}
              onChange={handleChange}
              isInvalid={!!errors.imagen}
            />
            <Form.Control.Feedback type="invalid">{errors.imagen}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="precio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese precio"
              name="price"
              value={producto.price}
              onChange={handleChange}
              isInvalid={!!errors.price}
              min="0.01"
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descripción del producto"
              name="description"
              value={producto.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button type="submit" className="agregar-producto-btn">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
}

export default EditarProducto;

