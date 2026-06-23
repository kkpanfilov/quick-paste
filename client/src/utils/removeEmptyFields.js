export function removeEmptyFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== ""),
  );
}
