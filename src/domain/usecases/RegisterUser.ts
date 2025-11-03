import { AuthRepository } from "../repositories/AuthRepository"; 
import { User } from "../entities/User";

export class RegisterUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(
        email: string, 
        password: string, 
        displayName: string
    ): Promise<User> {
        // 🟢 VALIDACIONES DE NEGOCIO
        if (!email || !password || !displayName) {
            throw new Error("Todos los campos son requeridos");
        }

        if (password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        if (displayName.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }

        // Validar formato de email (regex más robusto)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del email no es válido");
        }

        try {
            return await this.authRepository.register(email, password, displayName);
        } catch (err: any) {
            // Si el datasource ya regresó un mensaje amigable, reúsalo.
            const msg = err?.message || 'Error al registrar usuario';
            if (msg.toLowerCase().includes('email')) {
                // Normalizar mensaje específico para email ya registrado
                if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registrado') || msg.toLowerCase().includes('already-in-use')) {
                    throw new Error('El email ya está registrado');
                }
                throw new Error(msg);
            }
            throw new Error(msg);
        }
    }
}
