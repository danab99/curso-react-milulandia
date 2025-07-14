import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CarritoContext = createContext();

// Proveedor del contexto
export function CarritoProvider({ children }) {
    const [productosCarrito, setProductosCarrito] = useState([]);

    // Cargar carrito desde localStorage al inicializar
    useEffect(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            try {
                setProductosCarrito(JSON.parse(carritoGuardado));
            } catch (error) {
                console.error('Error al cargar carrito desde localStorage:', error);
            }
        }
    }, []);

    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(productosCarrito));
    }, [productosCarrito]);

    // Función para agregar producto al carrito
    const agregarAlCarrito = (producto) => {
        console.log("Agregando producto al carrito:", producto);
        
        setProductosCarrito(carritoActual => {
            const existe = carritoActual.find(p => p.id === producto.id);
            
            if (existe) {
                // Si existe, actualizar cantidad
                return carritoActual.map(p => 
                    p.id === producto.id 
                        ? { ...p, cantidad: p.cantidad + (producto.cantidad || 1) }
                        : p
                );
            } else {
                // Si no existe, agregarlo
                return [...carritoActual, { ...producto, cantidad: producto.cantidad || 1 }];
            }
        });
    };

    // Función para actualizar cantidad de un producto específico
    const actualizarCantidadProducto = (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        
        setProductosCarrito(carritoActual => 
            carritoActual.map(producto => 
                producto.id === id 
                    ? { ...producto, cantidad: nuevaCantidad }
                    : producto
            )
        );
    };

    // Función para incrementar cantidad
    const incrementarCantidad = (id) => {
        setProductosCarrito(carritoActual => 
            carritoActual.map(producto => 
                producto.id === id 
                    ? { ...producto, cantidad: producto.cantidad + 1 }
                    : producto
            )
        );
    };

    // Función para decrementar cantidad
    const decrementarCantidad = (id) => {
        setProductosCarrito(carritoActual => 
            carritoActual.map(producto => 
                producto.id === id && producto.cantidad > 1
                    ? { ...producto, cantidad: producto.cantidad - 1 }
                    : producto
            )
        );
    };

    // Función para vaciar carrito
    const vaciarCarrito = () => {
        setProductosCarrito([]);
    };

    // Función para borrar producto del carrito
    const borrarProductoCarrito = (id) => {
        console.log("Borrando producto con id:", id);
        setProductosCarrito(carritoActual => 
            carritoActual.filter(producto => producto.id !== id)
        );
    };

    // Función para obtener cantidad total de productos
    const obtenerCantidadTotal = () => {
        return productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    };

    // Función para obtener total del carrito
    const obtenerTotal = () => {
        return productosCarrito.reduce(
            (total, producto) => total + (producto.price * producto.cantidad), 
            0
        );
    };

    // Función para verificar si un producto está en el carrito
    const estaEnCarrito = (id) => {
        return productosCarrito.some(producto => producto.id === id);
    };

    // Función para obtener cantidad de un producto específico
    const obtenerCantidadProducto = (id) => {
        const producto = productosCarrito.find(p => p.id === id);
        return producto ? producto.cantidad : 0;
    };

    // Función para limpiar localStorage (útil para testing)
    const limpiarStorage = () => {
        localStorage.removeItem('carrito');
        setProductosCarrito([]);
    };

    const value = {
        // Estado
        productosCarrito,
        
        // Funciones principales
        agregarAlCarrito,
        borrarProductoCarrito,
        vaciarCarrito,
        
        // Funciones para manejo de cantidades
        actualizarCantidadProducto,
        incrementarCantidad,
        decrementarCantidad,
        
        // Funciones de utilidad
        obtenerCantidadTotal,
        obtenerTotal,
        estaEnCarrito,
        obtenerCantidadProducto,
        
        // Funciones adicionales
        limpiarStorage
    };

    return (
        <CarritoContext.Provider value={value}>
            {children}
        </CarritoContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export const useCarrito = () => {
    const context = React.useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
    }
    return context;
};