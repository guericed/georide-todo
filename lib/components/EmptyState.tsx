import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

/**
 * Empty state component
 * Displays when there are no items to show
 */
export function EmptyState({ title, message, icon = '📝' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: colors.neutral.gray500,
    textAlign: 'center',
    fontSize: 14,
  },
});
