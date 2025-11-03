import { Todo, CreateTodoDTO, UpdateTodoDTO } from "../entities/Todo"; 
export interface TodoRepository {
    getAll(userId: string): Promise<Todo[]>; // ← MODIFICADO: filtrar por userId
    getById(id: string): Promise<Todo | null>;
    create(todo: CreateTodoDTO): Promise<Todo>; // ← Ahora CreateTodoDTO incluye userId
    update(todo: UpdateTodoDTO): Promise<Todo>; 
    delete(id: string): Promise<void>;
}
