export type QueryType<T = unknown> = T & {
  page?: number;
  limit?: number;
  search?: string;
};
