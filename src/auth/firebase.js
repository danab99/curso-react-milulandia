import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  addDoc, 
  collection, 
  getDocs, 
  getFirestore, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxx-8_sRm52HHcES9cOTNHYBhspjQvKlQ",
  authDomain: "ecommerce-tp-milu.firebaseapp.com",
  projectId: "ecommerce-tp-milu",
  storageBucket: "ecommerce-tp-milu.firebasestorage.app",
  messagingSenderId: "309265531875",
  appId: "1:309265531875:web:49ed32cc8febd322a156d6",
  measurementId: "G-HBZF4Y7DZ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar idioma del dispositivo
auth.useDeviceLanguage();

// Configurar el provider de Google
const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');

//////////////////////////////////////////////////////////////////////
///////////////// AUTENTICACIÓN DE USUARIOS FIREBASE ////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Crear un nuevo usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario creado
 */
export function crearUsuario(email, password) {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      reject(new Error('Email y contraseña son requeridos'));
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuario creado exitosamente:", userCredential.user.uid);
        resolve(userCredential.user);
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error.code, error.message);
        reject(error);
      });
  });
}

/**
 * Iniciar sesión con Google
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario
 */
export function logearConGoogle() {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Login con Google exitoso:", result.user.uid);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        
        resolve({ user, token });
      })
      .catch((error) => {
        console.error("Error en login con Google:", error.code, error.message);
        reject(error);
      });
  });
}

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario
 */
export function loginEmailPass(email, password) {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      reject(new Error('Email y contraseña son requeridos'));
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login exitoso:", userCredential.user.uid);
        resolve(userCredential.user);
      })
      .catch((error) => {
        console.error("Error en login:", error.code, error.message);
        reject(error);
      });
  });
}

/**
 * Cerrar sesión del usuario actual
 * @returns {Promise<void>}
 */
export function cerrarSesion() {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada exitosamente");
        resolve();
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
        reject(error);
      });
  });
}

/**
 * Observar cambios en el estado de autenticación
 * @param {Function} callback - Función callback que recibe el usuario
 * @returns {Function} - Función para desuscribirse
 */
export function observarAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Obtener el usuario actual
 * @returns {Object|null} - Usuario actual o null si no está autenticado
 */
export function obtenerUsuarioActual() {
  return auth.currentUser;
}

/////////////////////////////////////////////////////////////////
///////////////////// BASE DE DATOS FIRESTORE //////////////////
/////////////////////////////////////////////////////////////////

/**
 * Crear un nuevo producto en Firestore
 * @param {string} name - Nombre del producto
 * @param {string} imagen - URL de la imagen
 * @param {number} price - Precio del producto
 * @param {string} description - Descripción del producto
 * @returns {Promise<Object>} - Promesa que resuelve con la referencia del documento
 */
export function crearProducto(name, imagen, price, description) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name || !price) {
        throw new Error('Nombre y precio son campos requeridos');
      }

      const docRef = await addDoc(collection(db, "productos"), {
        name: name,
        imagen: imagen || '',
        price: Number(price),
        description: description || '',
        createdAt: Timestamp.fromDate(new Date()),  // <- Cambio aquí
        updatedAt: Timestamp.fromDate(new Date())   // <- Y aquí
      });

      console.log("Producto creado con ID:", docRef.id);
      resolve(docRef);
    } catch (error) {
      console.error("Error al crear producto:", error);
      reject(error);
    }
  });
}


/**
 * Obtener todos los productos (CORREGIDO: ahora usa la colección 'productos')
 * @returns {Promise<Array>} - Promesa que resuelve con el array de productos
 */
export function obtenerProductos() {
  return new Promise(async (resolve, reject) => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos")); // CORREGIDO: era "users"
      
      const resultados = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          imagen: data.imagen,
          price: data.price,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      });

      console.log(`Se obtuvieron ${resultados.length} productos`);
      resolve(resultados);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      reject(error);
    }
  });
}

/**
 * Actualizar un producto existente
 * @param {string} id - ID del producto
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<void>}
 */
export function actualizarProducto(id, updates) {
  return new Promise(async (resolve, reject) => {
    try {
      const productRef = doc(db, "productos", id);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      console.log("Producto actualizado:", id);
      resolve();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      reject(error);
    }
  });
}

/**
 * Eliminar un producto
 * @param {string} id - ID del producto
 * @returns {Promise<void>}
 */
export function eliminarProducto(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      console.log("Producto eliminado:", id);
      resolve();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      reject(error);
    }
  });
}

/**
 * Buscar productos por nombre
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} - Promesa que resuelve con productos encontrados
 */
export function buscarProductos(searchTerm) {
  return new Promise(async (resolve, reject) => {
    try {
      const q = query(
        collection(db, "productos"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + '\uf8ff'),
        orderBy("name")
      );
      
      const querySnapshot = await getDocs(q);
      const resultados = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      resolve(resultados);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      reject(error);
    }
  });
}

export { auth, db };
