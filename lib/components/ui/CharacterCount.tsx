import { Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface CharacterCountProps {
  current: number;
  max: number;
}

export function CharacterCount({ current, max }: CharacterCountProps) {
  return (
    <Text style={styles.count}>
      {current} / {max} characters
    </Text>
  );
}

const styles = StyleSheet.create({
  count: {
    color: colors.neutral.gray500,
    fontSize: 14,
    marginBottom: 24,
  },
});
