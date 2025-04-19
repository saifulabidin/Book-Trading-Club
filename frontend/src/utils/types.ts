// Custom type definitions for common JavaScript APIs

// Type for setTimeout return value
export type TimeoutId = ReturnType<typeof setTimeout>;

// Type for setInterval return value 
export type IntervalId = ReturnType<typeof setInterval>;

// Common form field value types
export type FormFieldValue = string | number | readonly string[] | undefined;

// Ensure a value is a string or convert it to string safely
export function ensureString(value: FormFieldValue): string {
  if (value === undefined) return '';
  return String(value);
}

// Safely split a string that might be undefined/null
export function safeSplit(value: FormFieldValue, separator: string): string[] {
  const str = ensureString(value);
  return str ? str.split(separator) : [];
}
