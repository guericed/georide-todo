import { useMemo } from 'react';
import { useTodoStore } from '@/lib/stores/useTodoStore';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useDebounce } from './useDebounce';

export function useTodos() {
  const {
    todos,
    filter,
    searchQuery,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    setSearchQuery,
    refresh,
    clearError,
  } = useTodoStore();

  const { user } = useAuthStore();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredTodos = useMemo(() => {
    let result = todos;

    if (filter === 'active') {
      result = result.filter((todo) => !todo.isCompleted);
    } else if (filter === 'completed') {
      result = result.filter((todo) => todo.isCompleted);
    }

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
    }

    return result;
  }, [todos, filter, debouncedSearchQuery]);

  const activeTodosCount = useMemo(
    () => todos.filter((todo) => !todo.isCompleted).length,
    [todos]
  );

  const completedTodosCount = useMemo(
    () => todos.filter((todo) => todo.isCompleted).length,
    [todos]
  );

  const addTodoForCurrentUser = async (text: string) => {
    if (!user) throw new Error('No user logged in');
    await addTodo(text, user.id);
  };

  const fetchTodosForCurrentUser = async () => {
    if (!user) throw new Error('No user logged in');
    await fetchTodos(user.id);
  };

  const refreshForCurrentUser = async () => {
    if (!user) throw new Error('No user logged in');
    await refresh(user.id);
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    activeTodosCount,
    completedTodosCount,
    totalTodosCount: todos.length,
    filter,
    searchQuery,
    isLoading,
    error,
    fetchTodos: fetchTodosForCurrentUser,
    addTodo: addTodoForCurrentUser,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    setSearchQuery,
    refresh: refreshForCurrentUser,
    clearError,
    user,
  };
}
