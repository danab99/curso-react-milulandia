import { Card, Row, Col, Button, Form, Badge } from "react-bootstrap";
import { useState, useContext } from "react";
import { CarritoContext } from "../contexts/CarritoContext";

function CarritoCardBootstrap({ producto, funcionDisparadora }) {
    const [cantidad, setCantidad] = useState(producto.cantidad);
    const { actualizarCantidadProducto } = useContext(CarritoContext);

    function borrarDelCarrito() {
        funcionDisparadora(producto.id);
    }

    function actualizarCantidad(nuevaCantidad) {
        if (nuevaCantidad < 1) return;
        setCantidad(nuevaCantidad);
        // Si tienes la función actualizarCantidadProducto en tu contexto
        if (actualizarCantidadProducto) {
            actualizarCantidadProducto(producto.id, nuevaCantidad);
        }
    }

    function incrementarCantidad() {
        actualizarCantidad(cantidad + 1);
    }

    function decrementarCantidad() {
        if (cantidad > 1) {
            actualizarCantidad(cantidad - 1);
        }
    }

    const subtotal = (cantidad * producto.price).toFixed(2);

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row className="align-items-center">
                    {/* Imagen del producto */}
                    <Col xs={12} md={3} className="mb-3 mb-md-0">
                        <div className="position-relative">
                            <Card.Img
                                variant="top"
                                src={producto.imagen}
                                alt={producto.name}
                                style={{ 
                                    maxHeight: "120px", 
                                    objectFit: "cover", 
                                    width: "100%",
                                    borderRadius: "8px"
                                }}
                            />
                            {producto.descuento && (
                                <Badge 
                                    bg="danger" 
                                    className="position-absolute top-0 start-0 m-1"
                                >
                                    -{producto.descuento}%
                                </Badge>
                            )}
                        </div>
                    </Col>

                    {/* Información del producto */}
                    <Col xs={12} md={3} className="mb-3 mb-md-0">
                        <Card.Title className="h5 mb-2">{producto.name}</Card.Title>
                        <Card.Text className="text-muted small mb-0">
                            {producto.description}
                        </Card.Text>
                        {producto.categoria && (
                            <Badge bg="secondary" className="mt-1">
                                {producto.categoria}
                            </Badge>
                        )}
                    </Col>

                    {/* Controles de cantidad */}
                    <Col xs={6} md={2} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center justify-content-center">
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={decrementarCantidad}
                                disabled={cantidad <= 1}
                            >
                                -
                            </Button>
                            <Form.Control
                                type="number"
                                value={cantidad}
                                onChange={(e) => actualizarCantidad(parseInt(e.target.value) || 1)}
                                min="1"
                                max="99"
                                className="mx-2 text-center"
                                style={{ width: "60px" }}
                            />
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={incrementarCantidad}
                            >
                                +
                            </Button>
                        </div>
                        <small className="text-muted d-block text-center mt-1">
                            Cantidad
                        </small>
                    </Col>

                    {/* Precio unitario */}
                    <Col xs={6} md={2} className="mb-3 mb-md-0 text-center">
                        <div className="fw-bold text-primary">
                            ${producto.price.toFixed(2)}
                        </div>
                        <small className="text-muted">c/u</small>
                    </Col>

                    {/* Subtotal */}
                    <Col xs={6} md={1} className="mb-3 mb-md-0 text-center">
                        <div className="fw-bold fs-5">
                            ${subtotal}
                        </div>
                        <small className="text-muted">Subtotal</small>
                    </Col>

                    {/* Botón eliminar */}
                    <Col xs={6} md={1} className="text-center">
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={borrarDelCarrito}
                            className="rounded-circle"
                            style={{ width: "40px", height: "40px" }}
                            title="Eliminar producto"
                        >
                            ×
                        </Button>
                    </Col>
                </Row>

                {/* Información adicional en mobile */}
                <Row className="d-md-none mt-3">
                    <Col xs={12}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Precio unitario: ${producto.price.toFixed(2)}</span>
                            <span className="fw-bold">Subtotal: ${subtotal}</span>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CarritoCardBootstrap;