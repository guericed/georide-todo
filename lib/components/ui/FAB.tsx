import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface FABProps extends Omit<TouchableOpacityProps, 'style'> {
  icon?: string;
  onPress: () => void;
}

export function FAB({ icon = '+', onPress, ...props }: FABProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.fab}
      accessibilityRole="button"
      {...props}
    >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: colors.brand.primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    color: colors.neutral.white,
    fontSize: 32,
    fontWeight: '300',
  },
});
