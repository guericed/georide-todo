import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.dismiss}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.error.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.error.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: colors.error.dark,
    flex: 1,
    fontSize: 14,
  },
  dismiss: {
    color: colors.error.main,
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 14,
  },
});
