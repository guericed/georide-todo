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
 * ID counter for generating unique client-side IDs
 * Starts at a very high number to avoid collision with server IDs
 */
let clientIdCounter = Date.now();

/**
 * Generates a unique client-side ID for optimistic updates
 * Uses timestamp + incremental counter to guarantee uniqueness
 */
export function generateUniqueId(): number {
  return clientIdCounter++;
}

/**
 * Creates an optimistic todo with a client-generated ID
 * The ID will be replaced by the server-generated ID when the API responds
 */
export function createOptimisticTodo(text: string, userId: number): Todo {
  return {
    id: generateUniqueId(),
    text,
    isCompleted: false,
    userId,
  };
}
