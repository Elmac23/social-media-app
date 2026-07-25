export function arrayOf<T>(length: number, value: T): Array<T> {
  return Array.from(Array(length).keys()).map(() => value);
}
