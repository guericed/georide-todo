import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface AppHeaderProps {
  title: string;
  userName: string;
  userAvatar: string;
  onLogout: () => void;
}

export function AppHeader({ title, userName, userAvatar, onLogout }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>
            {userName} ({userAvatar})
          </Text>
        </View>
        <TouchableOpacity
          onPress={onLogout}
          style={styles.logoutButton}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.brand.primary,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.neutral.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: colors.brand.primaryLight,
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.brand.primaryDark,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: colors.neutral.white,
    fontWeight: '500',
    fontSize: 14,
  },
});
