export function nullIfBlank(value: string): string | null {
  return value.trim().length === 0 ? null : value;
}
