/**
 * Filter types for todo list
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * User type for mock authentication
 */
export interface User {
  readonly id: number;
  readonly name: string;
  readonly avatar: string;
}
