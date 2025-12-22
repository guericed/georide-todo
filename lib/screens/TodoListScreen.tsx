import { useState } from 'react';
import { View, FlatList, RefreshControl, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodos } from '@/lib/hooks/useTodos';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { SearchBar } from '@/lib/components/SearchBar';
import { TodoFilters } from '@/lib/components/TodoFilters';
import { TodoItem } from '@/lib/components/TodoItem';
import { LoadingSpinner } from '@/lib/components/LoadingSpinner';
import { ErrorMessage } from '@/lib/components/ErrorMessage';
import { EmptyState } from '@/lib/components/EmptyState';
import { AppHeader } from '@/lib/components/ui/AppHeader';
import { ErrorBanner } from '@/lib/components/ui/ErrorBanner';
import { FAB } from '@/lib/components/ui/FAB';
import { colors } from '@/lib/theme/colors';

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleToggle = async (id: number) => {
    await toggleTodo(id);
  };

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

  const handleEdit = (id: number) => {
    router.push(`/todos/${id}`);
  };

  const handleAddTodo = () => {
    router.push('/modal');
  };

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

  if (isLoading && allTodos.length === 0) {
    return <LoadingSpinner message="Loading todos..." />;
  }

  if (error && allTodos.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchTodos} />;
  }

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
      <AppHeader
        title="My Todos"
        userName={user?.name || ''}
        userAvatar={user?.avatar || ''}
        onLogout={handleLogout}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TodoFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        allCount={totalTodosCount}
        activeCount={activeTodosCount}
        completedCount={completedTodosCount}
      />

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

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
            tintColor={colors.brand.primary}
          />
        }
        contentContainerStyle={
          todos.length === 0 ? styles.listEmptyContent : styles.listContent
        }
      />

      <FAB
        onPress={handleAddTodo}
        accessibilityLabel="Add new todo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  listContent: {
    paddingBottom: 80,
  },
  listEmptyContent: {
    flex: 1,
  },
});
