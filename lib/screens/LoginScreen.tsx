import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { MOCK_USERS } from '@/lib/utils/config';

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome to Todo App
        </Text>
        <Text style={styles.headerSubtitle}>
          Select a user to continue
        </Text>
      </View>

      {/* User List */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Choose Your Profile
        </Text>

        <FlatList
          data={MOCK_USERS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleUserSelect(item)}
              style={styles.userCard}
              accessibilityRole="button"
              accessibilityLabel={`Login as ${item.name}`}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{item.avatar}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userId}>User ID: {item.id}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Footer */}
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
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#DBEAFE',
    fontSize: 16,
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
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 2,
  },
  userId: {
    color: '#6B7280',
    fontSize: 14,
  },
  chevron: {
    color: '#3B82F6',
    fontSize: 24,
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
