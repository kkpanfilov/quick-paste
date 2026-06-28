export function removeEmptyFields<T extends object>(
  obj: Partial<T>,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== ""),
  ) as Partial<T>;
}
