import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Todo, isTempTodo } from '@/lib/types/Todo';
import { colors } from '@/lib/theme/colors';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

/**
 * Individual todo item component
 * Displays a single todo with checkbox and action buttons
 * Memoized for performance optimization
 */
export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const isTemp = isTempTodo(todo);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => onToggle(todo.id)}
          style={[
            styles.checkbox,
            todo.isCompleted ? styles.checkboxChecked : styles.checkboxUnchecked,
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.isCompleted }}
          accessibilityLabel={`Mark todo as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
          disabled={isTemp}
        >
          {todo.isCompleted && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.todoText,
              todo.isCompleted && styles.todoTextCompleted,
              isTemp && styles.todoTextTemp,
            ]}
          >
            {todo.text}
          </Text>
          {isTemp && (
            <Text style={styles.savingText}>Saving...</Text>
          )}
        </View>

        {!isTemp && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onEdit(todo.id)}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Edit todo"
            >
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(todo.id)}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Delete todo"
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  checkboxUnchecked: {
    borderColor: colors.neutral.gray200,
  },
  checkmark: {
    color: colors.neutral.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: colors.neutral.black,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.neutral.gray400,
  },
  todoTextTemp: {
    opacity: 0.6,
  },
  savingText: {
    fontSize: 12,
    color: colors.neutral.gray400,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editIcon: {
    fontSize: 18,
  },
  deleteIcon: {
    fontSize: 18,
  },
});
