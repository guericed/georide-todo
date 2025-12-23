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

  const { allFiltered, activeFiltered, completedFiltered } = useMemo(() => {
    let searchFiltered = todos;
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      searchFiltered = todos.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
    }

    return {
      allFiltered: searchFiltered,
      activeFiltered: searchFiltered.filter((todo) => !todo.isCompleted),
      completedFiltered: searchFiltered.filter((todo) => todo.isCompleted),
    };
  }, [todos, debouncedSearchQuery]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return activeFiltered;
      case 'completed':
        return completedFiltered;
      default:
        return allFiltered;
    }
  }, [filter, allFiltered, activeFiltered, completedFiltered]);

  const activeTodosCount = activeFiltered.length;
  const completedTodosCount = completedFiltered.length;

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
    totalTodosCount: allFiltered.length,
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
