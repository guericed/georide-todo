import { TouchableOpacity, View, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { Avatar } from './Avatar';

interface UserCardProps extends Omit<TouchableOpacityProps, 'style'> {
  name: string;
  userId: number;
  avatar: string;
  onPress: () => void;
}

export function UserCard({ name, userId, avatar, onPress, ...props }: UserCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      {...props}
    >
      <Avatar emoji={avatar} size="medium" />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userId}>User ID: {userId}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    color: colors.neutral.black,
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 2,
  },
  userId: {
    color: colors.neutral.gray500,
    fontSize: 14,
  },
  chevron: {
    color: colors.brand.primary,
    fontSize: 24,
  },
});
