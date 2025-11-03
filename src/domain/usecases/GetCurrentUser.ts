import { AuthRepository } from "../repositories/AuthRepository"; 
import { User } from "../entities/User";

export class GetCurrentUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(): Promise<User | null> {
        return this.authRepository.getCurrentUser();
    }
}
