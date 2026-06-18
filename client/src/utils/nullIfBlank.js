export function nullIfBlank(value) {
  return value.trim().length === 0 ? null : value;
}
