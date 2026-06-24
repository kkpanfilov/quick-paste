export function removeEmptyFields(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== ""),
  );
}
