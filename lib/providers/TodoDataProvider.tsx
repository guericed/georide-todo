import { useEffect, useRef } from 'react';
import { useTodoStore } from '@/lib/stores/useTodoStore';
import { useAuthStore } from '@/lib/stores/useAuthStore';

interface TodoDataProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that handles automatic todo data management:
 * - Fetches todos when a user logs in
 * - Clears todos (including filters and search) when a user logs out or changes
 * This ensures todos are loaded/cleared centrally, independent of which screen is displayed.
 */
export function TodoDataProvider({ children }: TodoDataProviderProps) {
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const clearTodos = useTodoStore((state) => state.clearTodos);
  const user = useAuthStore((state) => state.user);
  const previousUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const previousUserId = previousUserIdRef.current;

    if (currentUserId !== previousUserId) {
      clearTodos();

      if (user) {
        void fetchTodos(user.id);
      }

      previousUserIdRef.current = currentUserId;
    }
  }, [user, fetchTodos, clearTodos]);

  return <>{children}</>;
}