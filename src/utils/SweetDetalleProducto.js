import Swal from "sweetalert2";

export const mostrarDetalleProducto = (producto) => {
  const obtenerImagen = (producto) => {
    const imagen = producto.image || producto.imagen || producto.imageUrl || "/placeholder-image.jpg";
    return imagen;
  };


  const manejarErrorImagen = () => {
    return `
      <div style="
        width: 100%; 
        height: 200px; 
        background-color: #f0f0f0; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border-radius: 8px;
        color: #666;
        font-size: 14px;
      ">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">📷</div>
          <div>Imagen no disponible</div>
        </div>
      </div>
    `;
  };

  const imagenSrc = obtenerImagen(producto);
  
  Swal.fire({
    title: producto.name || "Producto sin nombre",
    html: `
      <div style="text-align: center;">
        <img 
          src="${imagenSrc}" 
          alt="${producto.name || 'Producto'}" 
          style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:15px;" 
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div style="display:none;">
          ${manejarErrorImagen()}
        </div>
        <div style="text-align: left; margin-top: 15px;">
          <p><strong>Precio:</strong> $${producto.price || 'No especificado'}</p>
          <p><strong>Descripción:</strong></p>
          <p style="color: #666; line-height: 1.4;">${producto.description || 'Sin descripción disponible'}</p>
        </div>
      </div>
    `,
    showCloseButton: true,
    confirmButtonText: "Cerrar",
    width: '500px',
    customClass: {
      popup: 'swal-producto-popup'
    }
  });
};
