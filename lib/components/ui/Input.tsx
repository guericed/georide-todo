import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, { textAlignVertical: 'top' }]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.neutral.gray600,
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 8,
    padding: 16,
    color: colors.neutral.black,
    fontSize: 16,
    minHeight: 100,
  },
  error: {
    color: colors.error.main,
    fontSize: 14,
    marginTop: 8,
  },
});
