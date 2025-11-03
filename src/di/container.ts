// 🟢 DEPENDENCY INJECTION: Aquí se conectan todas las piezas
// Este es el único lugar que conoce las implementaciones concretas
import { FirebaseTodoDataSource } from '../data/datasources/FirebaseTodoDataDources';
import { TodoRepositoryFirebaseImpl } from '../data/repositories/TodoRepositoryFireaseImpl';
import { GetAllTodos } from '@/src/domain/usecases/GetAllTodo';
import { CreateTodo } from '@/src/domain/usecases/CreateTodo';
import { ToggleTodo } from '../domain/usecases/ToggleTodo';
import { DeleteTodo } from '@/src/domain/usecases/DeleteTodo';
import { FirebaseAuthDataSource } from "../data/datasources/FirebaseAuthDataSource";
import { AuthRepositoryImpl } from "../data/repositories/AuthRepositoryImpl";
import { RegisterUser } from "../domain/usecases/RegisterUser"; import { LoginUser } from "../domain/usecases/LoginUser"; import { LogoutUser } from "../domain/usecases/LogoutUser";
import { GetCurrentUser } from "../domain/usecases/GetCurrentUser"; import { AuthRepository } from "../domain/repositories/AuthRepository";


// 🟢 Singleton para mantener una sola instancia
class DIContainer {
    private static instance: DIContainer;
    private _dataSource: FirebaseTodoDataSource | null = null;
    private _repository: TodoRepositoryFirebaseImpl | null = null;
    private _authDataSource?: FirebaseAuthDataSource; 
    private _authRepository?: AuthRepository;
    private _registerUser?: RegisterUser; 
    private _loginUser?: LoginUser; 
    private _logoutUser?: LogoutUser;
    private _getCurrentUser?: GetCurrentUser;

  
    private constructor() {}
  
    static getInstance(): DIContainer {
      if (!DIContainer.instance) {
        DIContainer.instance = new DIContainer();
      }
      return DIContainer.instance;
    }
  
    async initialize(): Promise<void> {
      this._dataSource = new FirebaseTodoDataSource();
      await this._dataSource.initialize();
      this._repository = new TodoRepositoryFirebaseImpl(this._dataSource);

      // Inicializar datasource y repositorio de auth para asegurar observadores
      this._authDataSource = new FirebaseAuthDataSource();
      this._authRepository = new AuthRepositoryImpl(this._authDataSource);
      // Forzar carga inicial del usuario (puede usar AsyncStorage fallback)
      try {
        await this._authRepository.getCurrentUser();
      } catch (e) {
        console.warn('Error preloading current user', e);
      }
    }
  
    // 🟢 Use Cases - cada uno recibe el repository
    //Cada caso de uso necesita un repository para acceder a los datos
    get getAllTodos(): GetAllTodos {
      if (!this._repository) throw new Error('Container not initialized');
      return new GetAllTodos(this._repository);
    }
  
    get createTodo(): CreateTodo {
      if (!this._repository) throw new Error('Container not initialized');
      return new CreateTodo(this._repository);
    }
  
    get toggleTodo(): ToggleTodo {
      if (!this._repository) throw new Error('Container not initialized');
      return new ToggleTodo(this._repository);
    }
  
    get deleteTodo(): DeleteTodo {
      if (!this._repository) throw new Error('Container not initialized');
      return new DeleteTodo(this._repository);
    }
    get authDataSource(): FirebaseAuthDataSource { if (!this._authDataSource) {
    this._authDataSource = new FirebaseAuthDataSource();
    }
    return this._authDataSource;
    }

    get authRepository(): AuthRepository { if (!this._authRepository) {
    this._authRepository = new AuthRepositoryImpl(this.authDataSource);
    }
    return this._authRepository;
    }

    get registerUser(): RegisterUser { if (!this._registerUser) {
    this._registerUser = new RegisterUser(this.authRepository);
    }
    return this._registerUser;
    }

    get loginUser(): LoginUser { if (!this._loginUser) {
    this._loginUser = new LoginUser(this.authRepository);
    }
    return this._loginUser;
    }

    get logoutUser(): LogoutUser { if (!this._logoutUser) {
    this._logoutUser = new LogoutUser(this.authRepository);
    }
    return this._logoutUser;
    }

    get getCurrentUser(): GetCurrentUser { if (!this._getCurrentUser) {
    this._getCurrentUser = new GetCurrentUser(this.authRepository);
    }
    return this._getCurrentUser;
    }
}

export const container = DIContainer.getInstance();
