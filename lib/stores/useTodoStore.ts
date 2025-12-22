import { create } from 'zustand';
import { Todo, createTempTodo, isTempTodo, TodoFilter } from '@/lib/types/Todo';
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
      return newTodo;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add todo';
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== tempTodo.id),
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
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
      return updatedTodo;
    } catch (error) {
      // WARNING !!!
      // We silently catch the error since the API is actually not handling update on new todo.
      //const message = error instanceof Error ? error.message : 'Failed to update todo';
      //set({ todos: originalTodos, error: message });
      return null;
    }
  },

  deleteTodo: async (id: number) => {
    const todo = get().todos.find((t) => t.id === id);

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
      // WARNING !!!
      // We silently catch the error since the API is actually not handling delete on new todo.
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

    if (isTempTodo(todo)) {
      return todo;
    }

    try {
      const updatedTodo = await todoRepository.toggleTodo(id, newCompleted);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
      return updatedTodo;
    } catch (error) {
      // WARNING !!!
      // We silently catch the error since the API is actually not handling toggle on new todo.
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
