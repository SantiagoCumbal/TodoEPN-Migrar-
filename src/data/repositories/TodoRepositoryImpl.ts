import { TodoRepository } from "@/src/domain/repositories/TodoRepository";
import { Todo, CreateTodoDTO, UpdateTodoDTO } from "@/src/domain/entities/Todo";
import { SQLiteTodoDataSource } from "../datasources/SQLiteTodoDataSources";

export class TodoRepositoryIpml implements TodoRepository{
    constructor (private dataSource: SQLiteTodoDataSource){}
    async getAll(userId: string): Promise<Todo[]> {
        // El data source SQLite no usa userId (local), pero la interfaz exige recibirlo.
        // Ignoramos el parámetro y devolvemos todas las tareas locales.
        return await this.dataSource.getAllTodos();
    }
    async getById(id:string): Promise<Todo|null> {
        return await this.dataSource.getTodoById(id);
    }
    async create(data: CreateTodoDTO): Promise<Todo> {
        return await this.dataSource.createTodo(data.title)
    }
    async update(data: UpdateTodoDTO): Promise<Todo> {
        return await this.dataSource.updateTodo(
            data.id,
            data.completed,
            data.title,


        )
    }
    async delete(id: string): Promise<void> {
        await this.dataSource.deleteTodo(id);
    }

}