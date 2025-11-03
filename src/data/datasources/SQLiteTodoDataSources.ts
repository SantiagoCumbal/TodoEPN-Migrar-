// Es la única clase que conoce sobre SQLite
 
import * as SQLite from 'expo-sqlite';
import { Todo } from '@/src/domain/entities/Todo';
 
export class SQLiteTodoDataSource {
  private db: SQLite.SQLiteDatabase | null = null;
 
  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('todos.db');
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `);
  }
 
async getAllTodos(): Promise<Todo[]> {
    if (!this.db) throw new Error('Database not initialized');
 
    const rows = await this.db.getAllAsync<{
      id: number;
      title: string;
      completed: number;
      createdAt: string;
    }>('SELECT * FROM todos ORDER BY createdAt DESC');
 
    return rows.map(row => ({
      id: String(row.id),  // ← Convertir a string
      title: row.title,
      completed: row.completed === 1,
      createdAt: new Date(row.createdAt),
    }));
  }
 
  async getTodoById(id: string): Promise<Todo | null> {
    if (!this.db) throw new Error('Database not initialized');
 
    const row = await this.db.getFirstAsync<{
      id: number;
      title: string;
      completed: number;
      createdAt: string;
    }>('SELECT * FROM todos WHERE id = ?', [parseInt(id)]);  // ← Convertir a number para query
 
    if (!row) return null;
 
    return {
      id: String(row.id),  // ← Convertir a string
      title: row.title,
      completed: row.completed === 1,
      createdAt: new Date(row.createdAt),
    };
  }
 
  async createTodo(title: string): Promise<Todo> {
    if (!this.db) throw new Error('Database not initialized');
 
    const createdAt = new Date().toISOString();
    const result = await this.db.runAsync(
      'INSERT INTO todos (title, completed, createdAt) VALUES (?, ?, ?)',
      [title, 0, createdAt]
    );
 
    return {
      id: String(result.lastInsertRowId),  // ← Convertir a string
      title,
      completed: false,
      createdAt: new Date(createdAt),
    };
  }
 
  async updateTodo(id: string, completed?: boolean, title?: string): Promise<Todo> {
    if (!this.db) throw new Error('Database not initialized');
 
    const updates: string[] = [];
    const params: any[] = [];
 
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }
 
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
 
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }
 
    params.push(parseInt(id));  // ← Convertir a number para query
 
    await this.db.runAsync(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
 
    const updated = await this.getTodoById(id);
    if (!updated) throw new Error('Todo not found after update');
 
    return updated;
  }
 
  async deleteTodo(id: string): Promise<void> {  // ← Cambiar parámetro a string
    if (!this.db) throw new Error('Database not initialized');
 
    await this.db.runAsync('DELETE FROM todos WHERE id = ?', [parseInt(id)]);  // ← Convertir
  }
}