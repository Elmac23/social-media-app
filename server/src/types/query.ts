export type QueryType<T = unknown> = T & {
  page?: number;
  limit?: number;
  search?: string;
};

export type QueryWithOrderedBy<Keys extends string, T = unknown> = Omit<
  QueryType<T>,
  'orderBy'
> & {
  orderBy: `${Keys}-${'asc' | 'desc'}`;
};
