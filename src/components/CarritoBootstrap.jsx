import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Container, Alert, Modal } from "react-bootstrap";
import { CarritoContext } from "../contexts/CarritoContext";
import { AuthContext } from "../contexts/AuthContext.jsx";
import CarritoCardBootstrap from "./CarritoCardBootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CarritoBootstrap() {
    const { user } = useContext(AuthContext);
    const { productosCarrito, vaciarCarrito, borrarProductoCarrito } = useContext(CarritoContext);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Calcular total
    const total = productosCarrito.reduce(
        (subTotal, producto) => subTotal + producto.price * producto.cantidad,
        0
    );

    // Calcular cantidad total de productos
    const cantidadTotal = productosCarrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );

    // Función para borrar producto individual
    function funcionDisparadora(id) {
        borrarProductoCarrito(id);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    }

    // Función para vaciar carrito con confirmación
    function funcionDisparadora2() {
        setShowModal(true);
    }

    // Confirmar vaciado del carrito
    function confirmarVaciarCarrito() {
        vaciarCarrito();
        setShowModal(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    }

    function procederAlCheckout() {
        console.log("Procediendo al checkout...");
    }

    // Redirección si no hay usuario autenticado
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Carrito de compras</h2>
                {cantidadTotal > 0 && (
                    <span className="badge bg-primary fs-6">
                        {cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'}
                    </span>
                )}
            </div>

            {/* Alerta de confirmación */}
            {showAlert && (
                <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
                    Operación realizada con éxito
                </Alert>
            )}

            {/* Botones de acción */}
            {productosCarrito.length > 0 && (
                <div className="d-flex gap-2 mb-4">
                    <Button variant="outline-warning" onClick={funcionDisparadora2}>
                        Vaciar carrito
                    </Button>
                    <Button variant="success" onClick={procederAlCheckout}>
                        Proceder al pago
                    </Button>
                </div>
            )}

            {/* Lista de productos */}
            <Row xs={1} md={1} lg={1}>
                {productosCarrito.length > 0 ? (
                    productosCarrito.map((producto) => (
                        <Col key={producto.id} className="mb-3">
                            <CarritoCardBootstrap
                                producto={producto}
                                funcionDisparadora={funcionDisparadora}
                            />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <div className="text-center py-5">
                            <h4 className="text-muted">Tu carrito está vacío</h4>
                            <p className="text-muted">¡Agrega algunos productos para comenzar!</p>
                            <Button variant="primary" href="/productos">
                                Ir a productos
                            </Button>
                        </div>
                    </Col>
                )}
            </Row>

            {/* Resumen del total */}
            {total > 0 && (
                <div className="mt-4 p-3 bg-light rounded">
                    <Row>
                        <Col md={8}>
                            <h5>Resumen del pedido</h5>
                            <p className="mb-0">
                                Subtotal ({cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'}): 
                                <strong> ${total.toFixed(2)}</strong>
                            </p>
                        </Col>
                        <Col md={4} className="text-end">
                            <h4 className="mb-0">Total: ${total.toFixed(2)}</h4>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Modal de confirmación para vaciar carrito */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar acción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres vaciar todo el carrito? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmarVaciarCarrito}>
                        Sí, vaciar carrito
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default CarritoBootstrap;
