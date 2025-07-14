import "../../styles/Admin/AgregarProducto.css";
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { dispararSweetBasico } from '../../utils/SweetAlert';
import { agregarProducto } from '../../utils/requests';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function AgregarProducto() {
  const { admin } = useAuthContext();

  const [producto, setProducto] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  const validarCampo = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'El nombre es obligatorio.';
        break;
      case 'price':
        if (!value || Number(value) <= 0) error = 'El precio debe ser mayor a 0.';
        break;
      case 'description':
        if (!value.trim() || value.length < 10) error = 'Debe tener al menos 10 caracteres.';
        break;
      case 'image':
        if (!value.trim()) error = 'La URL no debe estar vacía.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validarCampo(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validarCampo('name', producto.name),
      price: validarCampo('price', producto.price),
      description: validarCampo('description', producto.description),
      image: validarCampo('image', producto.image)
    };

    setErrors(newErrors);

    const hayErrores = Object.values(newErrors).some(error => error !== '');

    if (hayErrores) {
      dispararSweetBasico('Error', 'Revisa los campos del formulario.', 'error', 'Cerrar');
      return;
    }

    try {
      await agregarProducto(producto);
      dispararSweetBasico("Producto agregado", "Se agregó correctamente.", "success", "Cerrar");
      setProducto({ name: '', price: '', description: '', image: '' });
      setErrors({});
    } catch (error) {
      dispararSweetBasico("Error", error.message || error, "error", "Cerrar");
    }
  };

  if (!admin) return <Navigate to="/login" replace />;

  return (
    <section className="agregar-producto-section">
      <div className="agregar-producto-header">
        <h2 className="agregar-producto-title">Agregar Producto</h2>
        <p className="agregar-producto-subtitle">Completá el formulario para añadir un nuevo producto</p>
      </div>

      <div className="agregar-producto-card">
        <div className="agregar-producto-icon">
          <i className="fas fa-plus"></i>
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
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>URL de la Imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese URL de la imagen"
              name="image" 
              value={producto.image} 
              onChange={handleChange}
              isInvalid={!!errors.image} 
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">
              {errors.price}
            </Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="agregar-producto-btn">
            Agregar Producto
          </Button>
        </Form>
      </div>
    </section>
  );
}

export default AgregarProducto;



