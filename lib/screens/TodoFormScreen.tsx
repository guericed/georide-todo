import { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTodos } from '@/lib/hooks/useTodos';
import { validateTodoText } from '@/lib/utils/validation';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import { CharacterCount } from '@/lib/components/ui/CharacterCount';

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
        <Text style={styles.header}>
          {mode === 'edit' ? 'Edit Todo' : 'New Todo'}
        </Text>

        <Input
          label="Todo Text"
          value={text}
          onChangeText={(value) => {
            setText(value);
            setError(null);
          }}
          placeholder="Enter todo text..."
          multiline
          numberOfLines={4}
          error={error}
          accessibilityLabel="Todo text input"
          accessibilityHint="Enter the text for your todo"
          autoFocus
        />

        <CharacterCount current={text.length} max={500} />

        <View style={styles.actions}>
          <Button
            variant="secondary"
            onPress={handleCancel}
            accessibilityLabel="Cancel"
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onPress={handleSave}
            accessibilityLabel={mode === 'edit' ? 'Save changes' : 'Add todo'}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : mode === 'edit' ? 'Save' : 'Add Todo'}
          </Button>
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
