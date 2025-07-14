import { useProductosContext } from "../../contexts/ProductosContext";
import { useEffect, useState } from "react";
import { Carousel, Container } from "react-bootstrap";

function CarruselBootstrap() {
    const { productos, obtenerProductos } = useProductosContext();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (productos.length === 0) {
            obtenerProductos().then(() => setCargando(false));
        } else {
            setCargando(false);
        }
    }, []);

    const primerosTres = productos.slice(0, 3);
    console.log("Productos para carrusel:", primerosTres);

    if (cargando) return <p>Cargando carrusel...</p>;
    if (primerosTres.length === 0) return <p>No hay productos para mostrar.</p>;

    return (
        <Container className="my-4">
            <Carousel>
                {primerosTres.map((producto) => (
                    <Carousel.Item key={producto.id}>
                        <img
                            className="d-block w-100"
                            src={producto.image || producto.imagen || producto.imageUrl || "/placeholder-image.jpg"}
                            alt={producto.name || "Producto"}
                            style={{ height: "400px", objectFit: "cover" }}
                            onError={(e) => {
                                console.error("Error cargando imagen:", producto);
                                e.target.src = "/placeholder-image.jpg"; // Imagen por defecto
                            }}
                        />
                        <Carousel.Caption>
                            <h3>{producto.name || "Producto sin nombre"}</h3>
                            <p>{producto.description || "Sin descripción"}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
}

export default CarruselBootstrap;
