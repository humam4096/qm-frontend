/**
 * Dashboard Helper Utilities
 * Provides safe number handling and calculations for dashboard metrics
 */

/**
 * Safely converts a value to a number, returning 0 if invalid
 */
export const safeNumber = (value: number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value !== 'number') return 0;
  if (isNaN(value)) return 0;
  if (!isFinite(value)) return 0;
  return Math.max(0, value); // Ensure non-negative
};

/**
 * Safely calculates a percentage, returning "0.0" if invalid
 */
export const safePercentage = (
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  decimals: number = 1
): string => {
  const num = safeNumber(numerator);
  const den = safeNumber(denominator);
  
  if (den === 0) return '0.0';
  
  const percentage = (num / den) * 100;
  
  if (isNaN(percentage) || !isFinite(percentage)) return '0.0';
  
  return Math.min(100, Math.max(0, percentage)).toFixed(decimals);
};

/**
 * Safely adds multiple numbers
 */
export const safeSum = (...values: (number | null | undefined)[]): number => {
  return values.reduce<number>((sum, value) => sum + safeNumber(value), 0);
};

/**
 * Safely subtracts two numbers
 */
export const safeSubtract = (
  a: number | null | undefined,
  b: number | null | undefined
): number => {
  return Math.max(0, safeNumber(a) - safeNumber(b));
};

/**
 * Formats a number for display, handling edge cases
 */
export const formatNumber = (value: number | null | undefined): string => {
  const num = safeNumber(value);
  return num.toLocaleString();
};

/**
 * Calculates active count from total and inactive
 */
export const calculateActive = (
  total: number | null | undefined,
  inactive: number | null | undefined
): number => {
  return safeSubtract(total, inactive);
};
