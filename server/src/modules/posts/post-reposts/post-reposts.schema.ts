export const postRepostsOrderByKeys = ['user', 'repostedAt', 'id'] as const;

export type PostRepostsOrderByKeys = (typeof postRepostsOrderByKeys)[number];
