export type Query<T = unknown> = T & {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
};
