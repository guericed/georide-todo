import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TodoFilter } from '../types/common';

interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  allCount: number;
  activeCount: number;
  completedCount: number;
}

/**
 * Todo filter tabs component
 * Allows switching between All/Active/Completed views
 */
export function TodoFilters({
  currentFilter,
  onFilterChange,
  allCount,
  activeCount,
  completedCount,
}: TodoFiltersProps) {
  const filters: Array<{ key: TodoFilter; label: string; count: number }> = [
    { key: 'all', label: 'All', count: allCount },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isActive = currentFilter === filter.key;
        return (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onFilterChange(filter.key)}
            style={[
              styles.tab,
              isActive ? styles.tabActive : styles.tabInactive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${filter.label} todos, ${filter.count} items`}
          >
            <Text style={[
              styles.tabLabel,
              isActive ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}>
              {filter.label}
            </Text>
            <Text style={[
              styles.tabCount,
              isActive ? styles.tabCountActive : styles.tabCountInactive,
            ]}>
              {filter.count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    borderBottomWidth: 2,
  },
  tabActive: {
    borderBottomColor: '#3B82F6',
  },
  tabInactive: {
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  tabLabelActive: {
    color: '#3B82F6',
  },
  tabLabelInactive: {
    color: '#6B7280',
  },
  tabCount: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  tabCountActive: {
    color: '#60A5FA',
  },
  tabCountInactive: {
    color: '#9CA3AF',
  },
});
