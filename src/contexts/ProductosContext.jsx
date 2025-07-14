import React, { createContext, useState, useContext } from 'react';
import * as productosAPI from '../utils/requests';

const ProductosContext = createContext();

export function ProductosProvider({ children }) {
    const [productos, setProductos] = useState([]);
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [productoEncontrado, setProductoEncontrado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    async function obtenerProductos(page = 1, limit = 50) {
        try {
            setCargando(true);
            setError(null);
            const datos = await productosAPI.obtenerProductos(page, limit);
            console.log('Productos obtenidos:', datos);
            
            setProductos(datos);
            setProductosOriginales(datos);
            setCargando(false);
            return datos;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            setError(error.message);
            setCargando(false);
            throw error;
        }
    }

    // Agregar un nuevo producto
    // async function agregarProducto(producto) {
    //     try {
    //         setCargando(true);
    //         setError(null);
    //         const nuevoProducto = await productosAPI.agregarProducto(producto);
            
    //         // Actualizar el estado local
    //         setProductos(prev => [...prev, nuevoProducto]);
    //         setProductosOriginales(prev => [...prev, nuevoProducto]);
            
    //         setCargando(false);
    //         return nuevoProducto;
    //     } catch (error) {
    //         console.error("Error al agregar producto:", error);
    //         setError(error.message);
    //         setCargando(false);
    //         throw error;
    //     }
    // }

    // Obtener un producto específico por ID
    async function obtenerProducto(id) {
        try {
            setCargando(true);
            setError(null);
            const producto = await productosAPI.obtenerProductoPorId(id);
            
            if (producto) {
                setProductoEncontrado(producto);
                setCargando(false);
                return producto;
            } else {
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener producto:", error);
            setError(error.message);
            setCargando(false);
            throw error;
        }
    }

    // Editar un producto existente
    // async function editarProducto(id, producto) {
    //     try {
    //         setCargando(true);
    //         setError(null);
    //         const productoActualizado = await productosAPI.actualizarProducto(id, producto);
            
    //         // Actualizar el estado local
    //         setProductos(prev => prev.map(p => p.id === id ? productoActualizado : p));
    //         setProductosOriginales(prev => prev.map(p => p.id === id ? productoActualizado : p));
            
    //         setCargando(false);
    //         return productoActualizado;
    //     } catch (error) {
    //         console.error("Error al editar producto:", error);
    //         setError(error.message);
    //         setCargando(false);
    //         throw error;
    //     }
    // }

    // Eliminar un producto
    // async function eliminarProducto(id) {
    //     const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    //     if (!confirmar) return;

    //     try {
    //         setCargando(true);
    //         setError(null);
    //         await productosAPI.eliminarProducto(id);
            
    //         // Actualizar el estado local
    //         setProductos(prev => prev.filter(p => p.id !== id));
    //         setProductosOriginales(prev => prev.filter(p => p.id !== id));
            
    //         setCargando(false);
    //         alert('Producto eliminado correctamente.');
    //     } catch (error) {
    //         console.error("Error al eliminar producto:", error);
    //         setError(error.message);
    //         setCargando(false);
    //         alert('Hubo un problema al eliminar el producto.');
    //         throw error;
    //     }
    // }

    // Filtrar productos por nombre
    function filtrarProductos(filtro) {
        if (!filtro || filtro.trim().length === 0) {
            setProductos(productosOriginales);
            return;
        }

        const productosFiltrados = productosOriginales.filter((producto) =>
            producto.name.toLowerCase().includes(filtro.toLowerCase()) ||
            (producto.description && producto.description.toLowerCase().includes(filtro.toLowerCase())) ||
            (producto.category && producto.category.toLowerCase().includes(filtro.toLowerCase()))
        );
        
        setProductos(productosFiltrados);
    }

    // Buscar productos (para búsquedas más complejas)
    function buscarProductos(termino, filtros = {}) {
        let productosFilter = [...productosOriginales];

        // Filtrar por término de búsqueda
        if (termino && termino.trim().length > 0) {
            productosFilter = productosFilter.filter((producto) =>
                producto.name.toLowerCase().includes(termino.toLowerCase()) ||
                (producto.description && producto.description.toLowerCase().includes(termino.toLowerCase())) ||
                (producto.category && producto.category.toLowerCase().includes(termino.toLowerCase()))
            );
        }

        // Filtrar por categoría
        if (filtros.category) {
            productosFilter = productosFilter.filter((producto) =>
                producto.category && producto.category.toLowerCase() === filtros.category.toLowerCase()
            );
        }

        // Filtrar por rango de precios
        if (filtros.minPrice !== undefined) {
            productosFilter = productosFilter.filter((producto) =>
                parseFloat(producto.price) >= parseFloat(filtros.minPrice)
            );
        }

        if (filtros.maxPrice !== undefined) {
            productosFilter = productosFilter.filter((producto) =>
                parseFloat(producto.price) <= parseFloat(filtros.maxPrice)
            );
        }

        setProductos(productosFilter);
    }

    // Limpiar filtros
    function limpiarFiltros() {
        setProductos(productosOriginales);
        setError(null);
    }

    const value = {
        // Estados
        productos,
        productosOriginales,
        productoEncontrado,
        cargando,
        error,
        
        // // Funciones CRUD
        obtenerProductos,
        // agregarProducto,
        obtenerProducto,
        // editarProducto,
        // eliminarProducto,
        
        // Funciones de filtrado y búsqueda
        filtrarProductos,
        buscarProductos,
        limpiarFiltros
    };

    return (
        <ProductosContext.Provider value={value}>
            {children}
        </ProductosContext.Provider>
    );
}

export const useProductosContext = () => {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error('useProductosContext debe ser usado dentro de un ProductosProvider');
    }
    return context;
};