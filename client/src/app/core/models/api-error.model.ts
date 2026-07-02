/**
 * Matches the ApiError shape. Used by the global error handling pattern.
 */
export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}
