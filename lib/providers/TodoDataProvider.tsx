import { useEffect } from 'react';
import { useTodoStore } from '@/lib/stores/useTodoStore';
import { useAuthStore } from '@/lib/stores/useAuthStore';

interface TodoDataProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that handles automatic todo data management:
 * - Fetches todos when a user logs in
 * - Clears todos when a user logs out
 * This ensures todos are loaded/cleared centrally, independent of which screen is displayed.
 */
export function TodoDataProvider({ children }: TodoDataProviderProps) {
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const clearTodos = useTodoStore((state) => state.clearTodos);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      void fetchTodos(user.id);
    } else {
      clearTodos();
    }
  }, [user]);

  return <>{children}</>;
}