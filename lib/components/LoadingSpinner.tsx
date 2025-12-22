import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

/**
 * Loading spinner component
 * Displays an activity indicator with optional message
 */
export function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.brand.primary} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.neutral.gray500,
    fontSize: 14,
  },
});
