import { auth, db, storage } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, writeBatch, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const loginUser = async (email: string, password: string): Promise<{success: boolean, message?: string}> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Logueado correctamente' };
  } catch (error: any) {
    let friendlyMessage = error.message;
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      friendlyMessage = 'El correo o la contraseña son incorrectos. Verifícalos e intenta nuevamente.';
    }
    return { success: false, message: friendlyMessage };
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<{success: boolean, message?: string}> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Guardar el perfil en la colección 'users' de Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    return { success: true, message: 'Registrado correctamente' };
  } catch (error: any) {
    let friendlyMessage = error.message;
    
    if (error.code === 'auth/email-already-in-use') {
      friendlyMessage = 'Este correo institucional YA está registrado. Por favor, intenta iniciar sesión.';
    } else if (error.code === 'auth/invalid-email') {
      friendlyMessage = 'El formato del correo ingresado no es válido.';
    } else if (error.code === 'auth/weak-password') {
      friendlyMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
    } else if (error.code === 'permission-denied') {
      friendlyMessage = 'El usuario se creó pero hubo error al guardar los extras por las reglas de Firestore (¿Diste en Publicar?).';
    }

    return { success: false, message: friendlyMessage };
  }
};

export const logoutUser = async (): Promise<{success: boolean}> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, message: 'No se encontró el perfil' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- PRODUCTOS ---

export const getProducts = async () => {
  try {
    const collRef = collection(db, 'products');
    const querySnapshot = await getDocs(collRef);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, message: 'Producto no encontrado' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Función para insertar datos de prueba si la BD está vacía
export const seedProducts = async () => {
  try {
    // 1. Borrar lo anterior para no tener duplicados
    const currentProducts = await getDocs(collection(db, 'products'));
    const deleteBatch = writeBatch(db);
    currentProducts.forEach((document) => {
      deleteBatch.delete(document.ref);
    });
    await deleteBatch.commit();

    // 2. Insertar los exactos 5 originales
    const batch = writeBatch(db);
    const mockProducts = [
      {
        nombre: 'Calculadora Offi-Esco OE-985',
        precio: 55000,
        estado: 'En perfecto estado',
        imagen: 'local:calculadora.png',
        categoria: 'Útiles',
        descripcion: 'Calculadora científica casi nueva, la usé un semestre en álgebra. Perfecta para estudiantes de ingeniería.',
        sellerEmail: 'testseller@uni.edu.co',
        sellerName: 'Juan Pérez'
      },
      {
        nombre: 'Libro de Cálculo',
        precio: 45000,
        estado: 'Usado',
        imagen: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
        categoria: 'Libros',
        descripcion: 'Libro base para cálculo diferencial e integral. Tiene algunas notas en lápiz pero las páginas están perfectas.',
        sellerEmail: 'maria.g@uni.edu.co',
        sellerName: 'Maria Gonzalez'
      },
      {
        nombre: 'iPad Pro 11"',
        precio: 1800000,
        estado: 'Usado',
        imagen: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
        categoria: 'Tecnología',
        descripcion: 'La vendo porque me regalaron otra. Incluye cargador original y funda genérica. Ideal para tomar apuntes en clase.',
        sellerEmail: 'carlos.tech@uni.edu.co',
        sellerName: 'Carlos Ruiz'
      },
      {
        nombre: 'Audífonos Sony',
        precio: 250000,
        estado: 'Nuevo',
        imagen: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
        categoria: 'Tecnología',
        descripcion: 'Audífonos de diadema con cancelación de ruido de Sony. Nuevos en caja.',
        sellerEmail: 'sofia.a@uni.edu.co',
        sellerName: 'Sofia Arias'
      },
      {
        nombre: 'Mouse Inalámbrico',
        precio: 35000,
        estado: 'Nuevo',
        imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop',
        categoria: 'Tecnología',
        descripcion: 'Mouse inalámbrico óptico con batería de larga duración. Diseño ergonómico.',
        sellerEmail: 'pedro@uni.edu.co',
        sellerName: 'Pedro López'
      }
    ];

    mockProducts.forEach((prod) => {
      const docRef = doc(collection(db, 'products'));
      batch.set(docRef, prod);
    });

    await batch.commit();
    return { success: true, message: 'Se restauraron los productos originales.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// --- CRUD MIS PUBLICACIONES ---

export const uploadImageAsync = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `products/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

export const addProduct = async (productData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getUserProducts = async (uid: string) => {
  try {
    const q = query(collection(db, 'products'), where('sellerId', '==', uid));
    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
