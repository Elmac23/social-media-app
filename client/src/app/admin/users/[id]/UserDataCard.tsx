import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { UserProfile } from "@/types/user";
import { formatDate } from "date-fns";
import React from "react";

function UserDataCard({
  user,
  children,
}: React.PropsWithChildren<{ user: UserProfile }>) {
  return (
    <Card>
      <div className="flex gap-4 mb-2">
        <Avatar
          className="self-start"
          size="xl"
          alt="user avatar"
          url={getAvatarUrl(user.avatarUrl)}
        />
        <div>
          <Typography as="h3" size="lg" bold>
            {`${user.name} ${user.lastname}`}
          </Typography>
          <Typography color="muted">@{user.login}</Typography>
        </div>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Badge>Id: {user.id}</Badge>
        <Badge>{user.role}</Badge>
        <Badge>{user.email}</Badge>
        {user.dateOfBirth && (
          <Badge>Born at: {formatDate(user.dateOfBirth, "dd/MM/yyyy")}</Badge>
        )}
        <Badge>Joined at: {formatDate(user.createdAt, "dd/MM/yyyy")}</Badge>
      </div>

      {user.bio && (
        <>
          <Typography bold className="mb-2">
            BIO:
          </Typography>
          <Typography
            as="pre"
            className="border-[1px] rounded-sm border-border p-2 mb-4"
          >
            {user.bio}
          </Typography>
        </>
      )}

      <div className="flex gap-2 flex-wrap">
        <Badge>Posts: {user.postsCount}</Badge>
        <Badge>Friends: {user.friendsCount}</Badge>
        <Badge>Followers: {user.followersCount}</Badge>
        <Badge>Following: {user.followingCount}</Badge>
        <Badge>Comments: {user.commentsCount}</Badge>
      </div>
      {children}
    </Card>
  );
}

export default UserDataCard;
