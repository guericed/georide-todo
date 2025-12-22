import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

/**
 * Search bar component
 * Allows filtering todos by text search
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search todos...',
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral.gray400}
          style={styles.input}
          accessibilityLabel="Search todos"
          accessibilityHint="Type to filter todos by text"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  icon: {
    color: colors.neutral.gray400,
    marginRight: 8,
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: colors.neutral.black,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearIcon: {
    color: colors.neutral.gray400,
    fontSize: 18,
  },
});
