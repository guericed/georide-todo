import { create } from 'zustand';
import { Todo, createOptimisticTodo, TodoFilter } from '@/lib/types/Todo';
import { todoRepository } from '@/lib/api/TodoRepository';
import { validateTodoText, sanitizeTodoText } from '@/lib/utils/validation';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchTodos: (userId: number) => Promise<Todo[]>;
  addTodo: (text: string, userId: number) => Promise<Todo | null>;
  updateTodo: (id: number, text: string) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<Todo | null>;
  setFilter: (filter: TodoFilter) => void;
  setSearchQuery: (query: string) => void;
  refresh: (userId: number) => Promise<Todo[]>;
  clearError: () => void;
  clearTodos: () => void;
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
      return todos;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch todos';
      set({ error: message, isLoading: false });
      return [];
    }
  },

  addTodo: async (text: string, userId: number) => {
    const validation = validateTodoText(text);
    if (!validation.isValid) {
      set({ error: validation.error });
      return null;
    }

    const sanitizedText = sanitizeTodoText(text);
    const optimisticTodo = createOptimisticTodo(sanitizedText, userId);

    set((state) => ({
      todos: [optimisticTodo, ...state.todos],
      error: null,
    }));

    try {
      // Make API call to persist (DummyJSON returns inconsistent IDs, so we keep our optimistic one)
      await todoRepository.createTodo(sanitizedText, userId);
      return optimisticTodo;
    } catch (error) {
      // On error, remove the optimistic todo and show error
      const message = error instanceof Error ? error.message : 'Failed to add todo';
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== optimisticTodo.id),
        error: message,
      }));
      return null;
    }
  },

  updateTodo: async (id: number, text: string) => {
    const validation = validateTodoText(text);
    if (!validation.isValid) {
      set({ error: validation.error });
      return null;
    }

    const sanitizedText = sanitizeTodoText(text);

    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, text: sanitizedText } : t)),
      error: null,
    }));

    try {
      const updatedTodo = await todoRepository.updateTodo(id, sanitizedText);
      return updatedTodo;
    } catch (error) {
      // WARNING: We silently catch the error since the API
      // is actually not handling update on new todo.
      //const message = error instanceof Error ? error.message : 'Failed to update todo';
      //set({ todos: originalTodos, error: message });
      return null;
    }
  },

  deleteTodo: async (id: number) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
      error: null,
    }));

    try {
      await todoRepository.deleteTodo(id);
    } catch (error) {
      // WARNING: We silently catch the error since DummyJSON API
      // doesn't properly handle delete for client-generated IDs
    }
  },

  toggleTodo: async (id: number) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return null;

    const newCompleted = !todo.isCompleted;

    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isCompleted: newCompleted } : t
      ),
      error: null,
    }));

    try {
      await todoRepository.toggleTodo(id, newCompleted);
      return { ...todo, isCompleted: newCompleted };
    } catch (error) {
      // WARNING: We silently catch the error since DummyJSON API
      // doesn't properly handle toggle for client-generated IDs
      //const message = error instanceof Error ? error.message : 'Failed to toggle todo';
      //set({ todos: originalTodos, error: message });
      return null;
    }
  },

  setFilter: (filter: TodoFilter) => set({ filter }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  refresh: async (userId: number) => await get().fetchTodos(userId),
  clearError: () => set({ error: null }),
  clearTodos: () => set({ todos: [], filter: 'all', searchQuery: '', error: null }),
}));
