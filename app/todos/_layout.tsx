import { Stack } from 'expo-router';
import { AuthGuard } from '@/lib/components/AuthGuard';

export default function TodosLayout() {
  return (
    <AuthGuard requireAuth={true}>
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
    </AuthGuard>
  );
}
