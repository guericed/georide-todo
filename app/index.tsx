import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { LoginScreen } from '../lib/screens/LoginScreen';

/**
 * Entry point - Login screen
 * Redirects to todos if already authenticated
 */
export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Redirect to todos if already logged in
    if (isAuthenticated) {
      router.replace('/todos');
    }
  }, [isAuthenticated]);

  return <LoginScreen />;
}