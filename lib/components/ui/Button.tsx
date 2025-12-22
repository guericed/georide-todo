import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors } from '@/lib/theme/colors';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  onPress: () => void;
  children: string;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  onPress,
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      disabled={disabled}
      {...props}
    >
      <Text style={[
        styles.text,
        variant === 'primary' ? styles.primaryText : styles.secondaryText,
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.brand.primary,
  },
  secondary: {
    backgroundColor: colors.neutral.gray100,
  },
  disabled: {
    backgroundColor: colors.brand.primaryPale,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  primaryText: {
    color: colors.neutral.white,
  },
  secondaryText: {
    color: colors.neutral.gray600,
  },
});
