export function unzipCountFields<
  T extends { _count: Record<string, number> },
  Keys extends keyof T['_count'] & string,
>(data: T, keys: Keys[]) {
  const { _count, ...rest } = data;
  const returned = { ...rest } as Omit<T, '_count'> & {
    [K in Keys as `${K}Count`]: number;
  };

  for (const key of keys) {
    (returned as any)[`${key}Count`] = _count[key];
  }

  return returned;
}
