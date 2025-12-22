import { User } from "@/lib/types/User";

/**
 * API Configuration
 */
export const API_BASE_URL = 'https://dummyjson.com';

/**
 * Pagination settings
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 30,
  DEFAULT_SKIP: 0,
} as const;

/**
 * Mock users for authentication
 * These user IDs exist in the DummyJSON API with todo data
 */
export const MOCK_USERS: readonly User[] = [
  { id: 1, name: 'John Doe', avatar: '👨' },
  { id: 2, name: 'Jane Smith', avatar: '👩' },
  { id: 3, name: 'Mike Johnson', avatar: '👨‍💼' },
  { id: 4, name: 'Sarah Williams', avatar: '👩‍💼' },
  { id: 5, name: 'Chris Brown', avatar: '🧑' },
] as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  TODO_MIN_LENGTH: 1,
  TODO_MAX_LENGTH: 500,
} as const;

