import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTodos } from '@/lib/hooks/useTodos';
import { validateTodoText } from '@/lib/utils/validation';

interface TodoFormScreenProps {
  mode?: 'add' | 'edit';
}

/**
 * Todo form screen component
 * Handles both adding new todos and editing existing ones
 */
export function TodoFormScreen({ mode = 'add' }: TodoFormScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; text?: string }>();
  const { addTodo, updateTodo, allTodos } = useTodos();

  const todoId = params.id ? parseInt(params.id, 10) : undefined;
  const existingTodo = todoId
    ? allTodos.find((t) => t.id === todoId)
    : undefined;

  const [text, setText] = useState(existingTodo?.text || params.text || '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingTodo) {
      setText(existingTodo.text);
    }
  }, [existingTodo]);

  const handleSave = async () => {
    // Validate input
    const validation = validateTodoText(text);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      if (mode === 'edit' && todoId) {
        await updateTodo(todoId, text);
      } else {
        await addTodo(text);
      }
      router.back();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save todo';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>
          {mode === 'edit' ? 'Edit Todo' : 'New Todo'}
        </Text>

        {/* Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Todo Text</Text>
          <TextInput
            value={text}
            onChangeText={(value) => {
              setText(value);
              setError(null);
            }}
            placeholder="Enter todo text..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            style={[styles.input, { textAlignVertical: 'top' }]}
            accessibilityLabel="Todo text input"
            accessibilityHint="Enter the text for your todo"
            autoFocus
          />
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* Character count */}
        <Text style={styles.charCount}>
          {text.length} / 500 characters
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.cancelButton}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            accessibilityRole="button"
            accessibilityLabel={mode === 'edit' ? 'Save changes' : 'Add todo'}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : mode === 'edit' ? 'Save' : 'Add Todo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    color: '#111827',
    fontSize: 16,
    minHeight: 100,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  charCount: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
