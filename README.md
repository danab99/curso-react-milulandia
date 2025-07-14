# 🐱 Milulandia — Entrega Final

Este proyecto es una tienda online enfocada en la venta de productos.

Desarrollado como **Entrega Final** del curso ReactJS de Tech Talent, cumple con todos los requerimientos funcionales y técnicos especificados.

---

## ✅ **Requerimiento #1: Gestión del Carrito y Autenticación de Usuarios**

### ✔️ Carrito de Compras con Context API

- Se implementa `CarritoContext` para gestionar productos agregados.
- Se pueden **agregar**, **eliminar** y **vaciar** productos del carrito.
- El estado global del carrito se mantiene mediante Context API.

### ✔️ Autenticación de Usuarios

- `AuthContext` gestiona el estado de autenticación.
- Se implementa un login simulado persistente con `localStorage`.
- Acceso restringido mediante **Rutas Protegidas**:
  - Solo usuarios autenticados pueden acceder al carrito y a las rutas de administración.

---

## ✅ **Requerimiento #2: CRUD de Productos con MockAPI**

### ✔️ Formulario para Agregar Productos

- Formulario controlado con `useState` y validación de campos:
  - Nombre obligatorio.
  - Precio mayor a 0.
  - Descripción mínima de 10 caracteres.
- Integración con **MockAPI** para operaciones `POST`.

### ✔️ Edición y Eliminación de Productos

- Edición de productos con formulario reutilizable.
- Eliminación con confirmación (`SweetAlert2`).
- Manejo de errores y mensajes claros para el usuario.
- Estados de carga y error implementados en la UI.

---

## ✅ **Requerimiento #3: Optimización de Diseño y Responsividad**

### ✔️ Diseño Responsivo

- Sistema de grillas y componentes de **Bootstrap**.
- Personalización de estilos con `styled-components` y CSS Modules.
- Diseño adaptativo para móviles y escritorio.

---

## **Tecnologías Utilizadas**

- **React** + **Vite**
- **React Router DOM**
- **Context API** (Auth & Carrito)
- **MockAPI** (API simulada)
- **Firebase** (autenticación)
- **Bootstrap**
- **SweetAlert2**


