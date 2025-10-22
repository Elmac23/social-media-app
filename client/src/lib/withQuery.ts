import { Query } from "@/types/query";

export function withQuery<T>(url: string, query?: Query<T>) {
  if (!query) return url;
  const { limit = 10, page = 1, search = "" } = query;
  return `${url}?limit=${limit}&page=${page}&search=${search}`;
}
