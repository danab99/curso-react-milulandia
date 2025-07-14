const API_BASE_URL = 'https://68749892dd06792b9c946738.mockapi.io/milulandia/productos';

export async function agregarProducto(producto) {
    try {
        console.log(producto)
        const respuesta = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });

        if (!respuesta.ok) {
            throw new Error(`Error al agregar el producto: ${respuesta.status} ${respuesta.statusText}`);
        }

        const data = await respuesta.json();
        console.log('Producto agregado:', data);
        return data;

    } catch (error) {
        console.error('Error en agregarProducto:', error.message);
        throw new Error('Hubo un problema al agregar el producto.');
    }
}

export async function obtenerProductos(page = 1, limit = 10) {
    try {
        const respuesta = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!respuesta.ok) {
            throw new Error(`Error al obtener productos: ${respuesta.status} ${respuesta.statusText}`);
        }

        const data = await respuesta.json();
        console.log('Productos obtenidos:', data);
        return data;

    } catch (error) {
        console.error('Error en obtenerProductos:', error.message);
        throw new Error('Hubo un problema al obtener los productos.');
    }
}


export async function eliminarProducto(id) {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!respuesta.ok) {
            throw new Error(`Error al eliminar el producto: ${respuesta.status} ${respuesta.statusText}`);
        }

        const data = await respuesta.json();
        console.log('Producto eliminado:', data);
        return data;

    } catch (error) {
        console.error('Error en eliminarProducto:', error.message);
        throw new Error('Hubo un problema al eliminar el producto.');
    }
}

export async function obtenerProductoPorId(id) {
  const respuesta = await fetch(`${API_BASE_URL}/${id}`);
  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener el producto con id ${id}`);
  }
  return await respuesta.json();
}

export async function actualizarProducto(id, producto) {
  try {
    const respuesta = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!respuesta.ok) {
      throw new Error(`Error al actualizar el producto: ${respuesta.status} ${respuesta.statusText}`);
    }

    const data = await respuesta.json();
    console.log("Producto actualizado:", data);
    return data;
  } catch (error) {
    console.error("Error en actualizarProducto:", error.message);
    throw new Error("Hubo un problema al actualizar el producto.");
  }
}
