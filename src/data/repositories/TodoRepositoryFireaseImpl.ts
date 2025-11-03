import { CreateTodoDTO, Todo, UpdateTodoDTO } from '@/src/domain/entities/Todo';
import { TodoRepository } from '@/src/domain/repositories/TodoRepository';
import { FirebaseTodoDataSource } from '../datasources/FirebaseTodoDataDources';

// 🟢 EXACTAMENTE LA MISMA ESTRUCTURA que TodoRepositoryImpl
// Solo cambia el data source que usa
 
export class TodoRepositoryFirebaseImpl implements TodoRepository {
  constructor(private dataSource: FirebaseTodoDataSource) {}
 
  async getAll(userId: string): Promise<Todo[]> {
    // Pasar userId al data source para que filtre por propietario
    return await this.dataSource.getAllTodos(userId);
  }
 
  async getById(id: string): Promise<Todo | null> {
    return await this.dataSource.getTodoById(id);
  }
 
  async create(data: CreateTodoDTO): Promise<Todo> {
    // Asegurarse de pasar userId al data source de Firebase
    return await this.dataSource.createTodo(data.title, data.userId);
  }
 
  async update(data: UpdateTodoDTO): Promise<Todo> {
    return await this.dataSource.updateTodo(
      data.id,
      data.completed,
      data.title
    );
  }
 
  async delete(id: string): Promise<void> {
    await this.dataSource.deleteTodo(id);
  }
}