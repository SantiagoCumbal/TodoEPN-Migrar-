import { AuthRepository } from "../repositories/AuthRepository"; 
export class LogoutUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<void> { 
        return this.authRepository.logout();
    }
}
