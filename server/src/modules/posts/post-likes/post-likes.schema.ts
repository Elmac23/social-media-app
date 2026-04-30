export const postLikesOrderByKeys = ['user', 'likedAt', 'id'] as const;

export type PostLikesOrderByKeys = (typeof postLikesOrderByKeys)[number];
