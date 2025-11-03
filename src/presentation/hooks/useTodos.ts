// 🟢 CUSTOM HOOK: La UI solo interactúa con este hook
// No conoce nada sobre SQLite, repositorios, o use cases

import { container } from "@/src/di/container";
import { Todo } from "@/src/domain/entities/Todo";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./useAuth"; // ← NUEVO: importar useAuth

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // ← NUEVO: obtener usuario actual

  const loadTodos = useCallback(async () => {
    // ← NUEVO: solo cargar si hay usuario autenticado
    if (!user) {
      setTodos([]); 
      setLoading(false); 
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // ← MODIFICADO: pasar userId
      console.log('useTodos.loadTodos: user.id =', user.id);
      const result = await container.getAllTodos.execute(user.id);
      console.log('useTodos.loadTodos: received', result.length, 'todos');
      setTodos(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setError(message);
      console.error('useTodos.loadTodos error:', error);
      Alert.alert("Error", "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [user]); // ← MODIFICADO: agregar user como dependencia

  useEffect(() => { 
    loadTodos();
  }, [loadTodos]);

  const addTodo = async (title: string): Promise<boolean> => {
    // ← NUEVO: validar que hay usuario
    if (!user) {
      Alert.alert("Error", "Debes estar autenticado para agregar tareas"); 
      return false;
    }

    try {
      // ← MODIFICADO: incluir userId en CreateTodoDTO
      const newTodo = await container.createTodo.execute({
        title,
        userId: user.id,
      });
      setTodos([newTodo, ...todos]); 
      return true;
    } catch (err) { 
      const message = err instanceof Error ? err.message : "Error al agregar tarea"; 
      Alert.alert("Error", message);
      return false;
    }
  };

  const toggleTodo = async (id: string): Promise<void> => { 
    try {
      const updatedTodo = await container.toggleTodo.execute(id); 
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const deleteTodo = async (id: string): Promise<void> => { 
    // Confirmar antes de eliminar
    Alert.alert(
      'Confirmar',
      '¿Estás seguro que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await container.deleteTodo.execute(id);
              setTodos(todos.filter((t) => t.id !== id));
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ]
    );
  };

  return { 
    todos, 
    loading, 
    error, 
    addTodo, 
    toggleTodo, 
    deleteTodo,
    refresh: loadTodos,
  };
};
