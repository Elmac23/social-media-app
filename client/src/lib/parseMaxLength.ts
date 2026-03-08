export function parseMaxLength(str?: string, limit: number = 20) {
  if (!str) return "";

  if (str.length > limit) return str.slice(0, limit) + "...";
  return str;
}
