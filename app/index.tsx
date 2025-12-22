import { AuthGuard } from '@/lib/components/AuthGuard';
import { LoginScreen } from '@/lib/screens/LoginScreen';

export default function Index() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginScreen />
    </AuthGuard>
  );
}