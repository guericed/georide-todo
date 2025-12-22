import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error message component
 * Displays an error message with optional retry button
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.errorBox}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryButton}
          accessibilityRole="button"
          accessibilityLabel="Retry"
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
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
  errorBox: {
    backgroundColor: colors.error.light,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
  errorTitle: {
    color: colors.error.dark,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
    fontSize: 16,
  },
  errorMessage: {
    color: colors.error.dark,
    textAlign: 'center',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: colors.brand.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.neutral.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
