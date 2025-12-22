import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface AvatarProps {
  emoji: string;
  size?: 'small' | 'medium' | 'large';
}

export function Avatar({ emoji, size = 'medium' }: AvatarProps) {
  const sizeStyles = {
    small: { width: 32, height: 32, borderRadius: 16 },
    medium: { width: 48, height: 48, borderRadius: 24 },
    large: { width: 64, height: 64, borderRadius: 32 },
  };

  const emojiSizes = {
    small: 16,
    medium: 24,
    large: 32,
  };

  return (
    <View style={[styles.container, sizeStyles[size]]}>
      <Text style={[styles.emoji, { fontSize: emojiSizes[size] }]}>
        {emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
});
