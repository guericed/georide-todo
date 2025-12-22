import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/stores/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Authentication guard component
 * Handles redirects based on authentication status
 *
 * @param requireAuth - If true, redirects to login when not authenticated
 *                      If false, redirects to todos when authenticated
 */
export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.replace('/');
    } else if (!requireAuth && isAuthenticated) {
      router.replace('/todos');
    }
  }, [isAuthenticated, requireAuth]);

  // Don't render children during redirect
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
}
