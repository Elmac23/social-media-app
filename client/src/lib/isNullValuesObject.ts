export function isNullValuesObject(obj: Record<string, unknown>) {
  return Object.values(obj).every((value) => value === null || value === "");
}
