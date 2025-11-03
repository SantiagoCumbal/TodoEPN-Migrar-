import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/Firebaseconfig";
import { User } from "@/src/domain/entities/User";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_CURRENT_USER = '@todoapp:currentUser';

export class FirebaseAuthDataSource {
    // ===== MÉTODO PRIVADO: CONVERTIR FIREBASEUSER A USER =====
    private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
        return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "Usuario",
        createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
        };
    }

    // ===== REGISTRO DE USUARIO =====
    async register(
        email: string,
        password: string,
        displayName: string
    ): Promise<User> {
        try {
        // 1. Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const firebaseUser = userCredential.user;

        // 2. Actualizar perfil en Auth (displayName)
        await updateProfile(firebaseUser, {
            displayName,
        });

        // 3. Guardar datos adicionales en Firestore
        await setDoc(doc(db, "users", firebaseUser.uid), {
            email,
            displayName,
            createdAt: new Date(),
        });

        // 4. Retornar usuario mapeado
        const user: User = {
            id: firebaseUser.uid,
            email,
            displayName,
            createdAt: new Date(),
        };

        // Persistir sesión localmente
        try {
        await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
        } catch (e) {
        console.warn('Failed to persist user to storage', e);
        }

        return user;
        } catch (error: any) {
        console.error("Error registering user:", error);

        // Mensajes de error más amigables
        if (error.code === "auth/email-already-in-use") {
            throw new Error("Este email ya está registrado");
        } else if (error.code === "auth/invalid-email") {
            throw new Error("Email inválido");
        } else if (error.code === "auth/weak-password") {
            throw new Error("La contraseña es muy débil");
        }

        throw new Error(error.message || "Error al registrar usuario");
        }
    }

    // ===== LOGIN =====
    async login(email: string, password: string): Promise<User> {
        try {
        // 1. Autenticar con Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const firebaseUser = userCredential.user;

        // 2. Obtener datos adicionales de Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        // 3. Retornar usuario completo
        const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName:
            userData?.displayName ||
            firebaseUser.displayName ||
            "Usuario",
        createdAt: userData?.createdAt?.toDate() || new Date(),
        };

        // Persistir sesión localmente
        try {
        await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
        } catch (e) {
        console.warn('Failed to persist user to storage', e);
        }

        return user;
        } catch (error: any) {
        console.error("Error logging in:", error);

        // Mensajes de error más amigables
        if (error.code === "auth/user-not-found") {
            throw new Error("Usuario no encontrado");
        } else if (error.code === "auth/wrong-password") {
            throw new Error("Contraseña incorrecta");
        } else if (error.code === "auth/invalid-credential") {
            throw new Error("Credenciales inválidas");
        }

        throw new Error(error.message || "Error al iniciar sesión");
        }
    }

    // ===== LOGOUT =====
    async logout(): Promise<void> {
        try {
        await signOut(auth);
        // Remover session almacenada
        try {
            await AsyncStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        } catch (e) {
            console.warn('Failed to remove user from storage', e);
        }
        } catch (error: any) {
        console.error("Error logging out:", error);
        throw new Error(error.message || "Error al cerrar sesión");
        }
    }

    // ===== OBTENER USUARIO ACTUAL =====
    async getCurrentUser(): Promise<User | null> {
        try {
        const firebaseUser = auth.currentUser;
        console.log('FirebaseAuthDataSource.getCurrentUser: auth.currentUser =', firebaseUser ? firebaseUser.uid : null);
        if (firebaseUser) return this.mapFirebaseUserToUser(firebaseUser);

        // Fallback: intentar recuperar usuario persistido en AsyncStorage
        try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_CURRENT_USER);
        console.log('FirebaseAuthDataSource.getCurrentUser: AsyncStorage raw =', raw);
        if (!raw) return null;
        const parsed: User = JSON.parse(raw);
        return parsed;
        } catch (e) {
        console.warn('Failed to read user from storage', e);
        return null;
        }
        } catch (error) {
        console.error("Error getting current user:", error);
        return null;
        }
    }

    // ===== OBSERVAR CAMBIOS DE AUTENTICACIÓN =====
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        // Retorna función de desuscripción
        return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
        console.log('FirebaseAuthDataSource.onAuthStateChanged: firebaseUser =', firebaseUser ? firebaseUser.uid : null);
        if (firebaseUser) {
            const user = this.mapFirebaseUserToUser(firebaseUser);
            // Persistir en local storage
            try {
            await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
            } catch (e) {
            console.warn('Failed to persist user from auth state change', e);
            }
            callback(user);
        } else {
            // No eliminar el usuario del storage aquí: durante el arranque
            // onAuthStateChanged puede emitir null momentáneamente antes de que
            // el estado se restaure o nuestro fallback lea AsyncStorage.
            // Eliminamos el storage sólo en logout() explícito.
            console.log('FirebaseAuthDataSource.onAuthStateChanged: no firebase user (will not remove AsyncStorage)');
            callback(null);
        }
        });
    }

    // ===== ACTUALIZAR PERFIL =====
    async updateProfile(userId: string, displayName: string): Promise<User> {
        try {
        const current = auth.currentUser;
        if (!current) throw new Error('No authenticated user');

        await updateProfile(current, { displayName });

        // Actualizar en Firestore
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { displayName });

        const updatedUser: User = {
        id: current.uid,
        email: current.email || '',
        displayName: displayName,
        createdAt: new Date(current.metadata.creationTime || Date.now()),
        };

        // Persistir cambio
        try { await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser)); } catch (e) { console.warn('Failed to persist updated user', e); }

        return updatedUser;
        } catch (error: any) {
        console.error('Error updating profile:', error);
        throw new Error(error.message || 'Error updating profile');
        }
    }

    // ===== RESET PASSWORD =====
    async sendPasswordReset(email: string): Promise<void> {
        try {
        console.log('FirebaseAuthDataSource.sendPasswordReset: sending reset email to', email);
        await sendPasswordResetEmail(auth, email);
        console.log('FirebaseAuthDataSource.sendPasswordReset: email sent to', email);
        } catch (error: any) {
        console.error('Error sending password reset email:', error);
        if (error.code === 'auth/user-not-found') {
            throw new Error('Usuario no encontrado');
        }
        // If Firebase returns a more specific code/message, rethrow for UI layer
        throw new Error(error.message || 'Error al enviar email de recuperación');
        }
    }
}
