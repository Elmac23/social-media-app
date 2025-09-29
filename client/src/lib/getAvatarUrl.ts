export function getAvatarUrl(avatarPath: string | null | undefined) {
  if (!avatarPath) {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/public/avatars/default.jpg`;
  }
  return `${process.env.NEXT_PUBLIC_SERVER_URL}${avatarPath}`;
}
