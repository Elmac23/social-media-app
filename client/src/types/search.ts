export type CreateSearch = {
  content: string;
  avatarUrl?: string;
  href: string;
  type: "USER" | "SEARCH";
};

export type Search = CreateSearch & {
  id: string;
};
