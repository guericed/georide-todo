import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodos } from '@/lib/hooks/useTodos';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { SearchBar } from '@/lib/components/SearchBar';
import { TodoFilters } from '@/lib/components/TodoFilters';
import { TodoItem } from '@/lib/components/TodoItem';
import { LoadingSpinner } from '@/lib/components/LoadingSpinner';
import { ErrorMessage } from '@/lib/components/ErrorMessage';
import { EmptyState } from '@/lib/components/EmptyState';

/**
 * Main todo list screen component
 * Displays all todos with filtering, searching, and CRUD operations
 */
export function TodoListScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const {
    todos,
    allTodos,
    filter,
    searchQuery,
    isLoading,
    error,
    activeTodosCount,
    completedTodosCount,
    totalTodosCount,
    fetchTodos,
    toggleTodo,
    deleteTodo,
    setFilter,
    setSearchQuery,
    refresh,
    clearError,
  } = useTodos();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  // Handle todo toggle
  const handleToggle = async (id: number) => {
    await toggleTodo(id);
  };

  // Handle todo delete
  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTodo(id),
        },
      ]
    );
  };

  // Handle todo edit
  const handleEdit = (id: number) => {
    router.push(`/todos/${id}`);
  };

  // Handle add new todo
  const handleAddTodo = () => {
    router.push('/modal');
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  // Loading state
  if (isLoading && allTodos.length === 0) {
    return <LoadingSpinner message="Loading todos..." />;
  }

  // Error state
  if (error && allTodos.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchTodos} />;
  }

  // Determine empty state message
  const getEmptyStateProps = () => {
    if (searchQuery.trim()) {
      return {
        title: 'No Results',
        message: 'No todos match your search',
        icon: '🔍',
      };
    }
    if (filter === 'active') {
      return {
        title: 'All Done!',
        message: 'You have no active todos',
        icon: '✅',
      };
    }
    if (filter === 'completed') {
      return {
        title: 'No Completed Todos',
        message: 'Complete some todos to see them here',
        icon: '📋',
      };
    }
    return {
      title: 'No Todos Yet',
      message: 'Tap the + button to create your first todo',
      icon: '📝',
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Todos</Text>
            <Text style={styles.headerSubtitle}>
              {user?.name} ({user?.avatar})
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityRole="button"
            accessibilityLabel="Logout"
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filters */}
      <TodoFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        allCount={totalTodosCount}
        activeCount={activeTodosCount}
        completedCount={completedTodosCount}
      />

      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorBannerDismiss}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        ListEmptyComponent={<EmptyState {...getEmptyStateProps()} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        contentContainerStyle={
          todos.length === 0 ? styles.listEmptyContent : styles.listContent
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={handleAddTodo}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Add new todo"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorBannerText: {
    color: '#B91C1C',
    flex: 1,
    fontSize: 14,
  },
  errorBannerDismiss: {
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80,
  },
  listEmptyContent: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
});
