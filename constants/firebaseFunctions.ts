import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
