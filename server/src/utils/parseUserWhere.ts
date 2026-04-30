export function parseUserWhere(search?: string) {
  if (!search) return {};

  const strippedSearch = search.trim();
  if (strippedSearch.length === 0) return {};

  let where = {};
  if (strippedSearch.split(' ').length === 1)
    where = {
      OR: [
        { login: { contains: strippedSearch, mode: 'insensitive' as const } },
        { id: { contains: strippedSearch, mode: 'insensitive' as const } },
        { name: { contains: strippedSearch, mode: 'insensitive' as const } },
        {
          lastname: { contains: strippedSearch, mode: 'insensitive' as const },
        },
      ],
    };
  else {
    const names = strippedSearch.split(' ');
    const firstName = names[0];
    const lastName = names[1];

    where = {
      OR: [
        {
          AND: [
            { name: { contains: firstName, mode: 'insensitive' as const } },
            {
              lastname: { contains: lastName, mode: 'insensitive' as const },
            },
          ],
        },
        {
          AND: [
            { name: { contains: lastName, mode: 'insensitive' as const } },
            {
              lastname: { contains: firstName, mode: 'insensitive' as const },
            },
          ],
        },
      ],
    };
  }

  return where;
}
