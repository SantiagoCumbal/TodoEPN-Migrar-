import { Todo, CreateTodoDTO } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class CreateTodo {
    constructor(private repository: TodoRepository) {}

        async execute(data: CreateTodoDTO): Promise<Todo> {
        // 🟢 Validaciones de negocio 
        if (!data.title.trim()) {
            throw new Error("El título no puede estar vacío");
        }

        if (data.title.length > 200) {
            throw new Error("El título es demasiado largo");
        }

        // ← NUEVO: Validar que userId esté presente
        if (!data.userId) {
            throw new Error("User ID is required");
        }

        return await this.repository.create(data);
    }
}
