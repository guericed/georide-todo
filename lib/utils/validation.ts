import { VALIDATION } from './config';

/**
 * Validation utilities for user input
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates todo text input
 */
export function validateTodoText(text: string): ValidationResult {
  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    return {
      isValid: false,
      error: 'Todo text cannot be empty.',
    };
  }

  if (trimmedText.length < VALIDATION.TODO_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Todo must be at least ${VALIDATION.TODO_MIN_LENGTH} character(s).`,
    };
  }

  if (trimmedText.length > VALIDATION.TODO_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Todo must not exceed ${VALIDATION.TODO_MAX_LENGTH} characters.`,
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Sanitizes todo text by trimming whitespace and limiting length
 */
export function sanitizeTodoText(text: string): string {
  return text.trim().slice(0, VALIDATION.TODO_MAX_LENGTH);
}
