export const commentLikeOrderByKeys = ['user', 'likedAt', 'id'] as const;

export type CommentLikesOrderByKeys = (typeof commentLikeOrderByKeys)[number];
