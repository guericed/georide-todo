/**
 * Simple error handling utility
 */

/**
 * Logs errors in development mode
 */
export function logError(context: string, error: unknown): void {
  if (__DEV__) {
    console.error(`[${context}]`, error);
  }
}
