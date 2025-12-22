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
 * Factory function to create a new Todo
 */
export function createTodo(
  id: number,
  text: string,
  isCompleted: boolean,
  userId: number
): Todo {
  return {
    id,
    text,
    isCompleted,
    userId,
  };
}

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
