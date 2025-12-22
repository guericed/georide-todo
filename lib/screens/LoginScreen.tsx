import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { MOCK_USERS } from '@/lib/utils/config';
import { PageHeader } from '@/lib/components/ui/PageHeader';
import { UserCard } from '@/lib/components/ui/UserCard';

/**
 * Login screen component
 * Allows user to select a mock user for authentication
 */
export function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleUserSelect = (user: typeof MOCK_USERS[number]) => {
    login(user);
    router.replace('/todos');
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Welcome to Todo App"
        subtitle="Select a user to continue"
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Choose Your Profile
        </Text>

        <FlatList
          data={MOCK_USERS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserCard
              name={item.name}
              userId={item.id}
              avatar={item.avatar}
              onPress={() => handleUserSelect(item)}
              accessibilityLabel={`Login as ${item.name}`}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a demo app using DummyJSON API
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#374151',
    fontWeight: '600',
    marginBottom: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
});
