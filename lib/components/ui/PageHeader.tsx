import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.brand.primary,
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.neutral.white,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.brand.primaryLight,
    fontSize: 16,
  },
});
