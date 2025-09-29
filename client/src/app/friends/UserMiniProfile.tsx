import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { User } from "@/types/user";
import Link from "next/link";
import React from "react";

type UserMiniProfileProps = React.PropsWithChildren & {
  user: User;
  className?: string;
  isBody?: boolean;
};

function UserMiniProfile({
  user,
  children,
  className,
  isBody,
}: UserMiniProfileProps) {
  const avatarUrl = getAvatarUrl(user.avatarUrl);
  if (isBody)
    return (
      <Card className={cn("cursor-pointer", className)}>
        <Link href={`/profile/${user.id}`} className="cursor-pointer">
          <div className="flex gap-4 items-center">
            <Avatar alt={user.login} url={avatarUrl} />
            <Typography className="mb-2">
              {user.name} {user.lastname}
            </Typography>
          </div>
          <Typography color="muted" size="sm" className="mb-4">
            @{user.login}
          </Typography>
        </Link>
        {children}
      </Card>
    );

  return (
    <Link href={`/profile/${user.id}`} className="cursor-pointer">
      <Card className={className}>
        <div className="flex gap-4 items-center">
          <Avatar alt={user.login} url={avatarUrl} />
          <Typography className="mb-2">
            {user.name} {user.lastname}
          </Typography>
        </div>
        <Typography color="muted" size="sm" className="mb-4">
          @{user.login}
        </Typography>
      </Card>
    </Link>
  );
}

export default UserMiniProfile;
