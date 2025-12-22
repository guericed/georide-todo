import { Stack } from 'expo-router';

/**
 * Root layout for the app
 * Configures the navigation structure
 */
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="todos" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Add Todo',
        }}
      />
    </Stack>
  );
}
