export function parseOrderBy<Keys extends string>(
  orderBy: `${Keys}-${'asc' | 'desc'}` | null,
  map?: Partial<Record<Keys, (value: 'asc' | 'desc') => unknown>>,
) {
  if (!orderBy) return undefined;
  const keys = Object.keys(map);

  const [key, order] = orderBy.split('-');

  if (keys.includes(key)) return map[key](order);

  return {
    [key]: order,
  };
}
