import { create } from 'zustand';
import { Todo, createTempTodo, isTempTodo } from '../types/Todo';
import { TodoFilter } from '../types/common';
import { todoRepository } from '../api/TodoRepository';
import { validateTodoText, sanitizeTodoText } from '../utils/validation';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchTodos: (userId: number) => Promise<void>;
  addTodo: (text: string, userId: number) => Promise<void>;
  updateTodo: (id: number, text: string) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
  setSearchQuery: (query: string) => void;
  refresh: (userId: number) => Promise<void>;
  clearError: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  filter: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchTodos: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todoRepository.getTodos(userId);
      set({ todos, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch todos';
      set({ error: message, isLoading: false });
    }
  },

  addTodo: async (text: string, userId: number) => {
    const validation = validateTodoText(text);
    if (!validation.isValid) {
      set({ error: validation.error });
      return;
    }

    const sanitizedText = sanitizeTodoText(text);
    const tempTodo = createTempTodo(sanitizedText, userId);

    set((state) => ({
      todos: [tempTodo, ...state.todos],
      error: null,
    }));

    try {
      const newTodo = await todoRepository.createTodo(sanitizedText, userId);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === tempTodo.id ? newTodo : t)),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add todo';
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== tempTodo.id),
        error: message,
      }));
    }
  },

  updateTodo: async (id: number, text: string) => {
    const validation = validateTodoText(text);
    if (!validation.isValid) {
      set({ error: validation.error });
      return;
    }

    const sanitizedText = sanitizeTodoText(text);
    const originalTodos = get().todos;

    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, text: sanitizedText } : t)),
      error: null,
    }));

    try {
      const updatedTodo = await todoRepository.updateTodo(id, sanitizedText);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update todo';
      set({ todos: originalTodos, error: message });
    }
  },

  deleteTodo: async (id: number) => {
    const originalTodos = get().todos;
    const todo = originalTodos.find((t) => t.id === id);

    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
      error: null,
    }));

    if (todo && isTempTodo(todo)) {
      return;
    }

    try {
      await todoRepository.deleteTodo(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete todo';
      set({ todos: originalTodos, error: message });
    }
  },

  toggleTodo: async (id: number) => {
    const originalTodos = get().todos;
    const todo = originalTodos.find((t) => t.id === id);
    if (!todo) return;

    const newCompleted = !todo.isCompleted;

    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isCompleted: newCompleted } : t
      ),
      error: null,
    }));

    if (isTempTodo(todo)) {
      return;
    }

    try {
      const updatedTodo = await todoRepository.toggleTodo(id, newCompleted);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle todo';
      set({ todos: originalTodos, error: message });
    }
  },

  setFilter: (filter: TodoFilter) => set({ filter }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  refresh: async (userId: number) => await get().fetchTodos(userId),
  clearError: () => set({ error: null }),
}));
