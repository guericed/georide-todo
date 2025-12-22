/**
 * Core Todo entity (domain model)
 * This is a pure business model with no framework dependencies
 */

export interface Todo {
  readonly id: number;
  readonly text: string;
  readonly isCompleted: boolean;
  readonly userId: number;
}

/**
 * Filter types for todo list
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Creates a temporary todo for optimistic updates
 * Uses negative ID to differentiate from server-generated IDs
 */
export function createTempTodo(text: string, userId: number): Todo {
  return {
    id: -Date.now(), // Negative timestamp as temporary ID
    text,
    isCompleted: false,
    userId,
  };
}

/**
 * Checks if a todo is a temporary one (optimistic update)
 */
export function isTempTodo(todo: Todo): boolean {
  return todo.id < 0;
}
