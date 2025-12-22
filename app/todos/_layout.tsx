import { Stack } from 'expo-router';
import { AuthGuard } from '@/lib/components/AuthGuard';
import { TodoDataProvider } from '@/lib/providers/TodoDataProvider';

export default function TodosLayout() {
  return (
    <AuthGuard requireAuth={true}>
      <TodoDataProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="[id]"
            options={{
              headerShown: true,
              title: 'Edit Todo',
              presentation: 'card',
            }}
          />
        </Stack>
      </TodoDataProvider>
    </AuthGuard>
  );
}
