export async function tryOrUndefined<T>(f: Promise<T>) {
  try {
    return await f;
  } catch (e) {
    return undefined;
  }
}
