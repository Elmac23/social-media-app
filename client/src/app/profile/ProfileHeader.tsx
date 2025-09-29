import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import React from "react";
import { User } from "@/types/user";
import { getUser } from "@/lib/getUser";
import ProfileAvatar from "./ProfileAvatar";
import Button from "@/components/ui/Button";
import FollowButton from "../../components/buttons/FollowButton";
import { getInvites, getUserFriends } from "@/api/friends";
import AddFriendButton from "../../components/buttons/AddFriendButton";
import JSONDebug from "@/components/JSONDebug";
import AcceptFriendButton from "../../components/buttons/AcceptFriendButton";
import DeclineInviteButton from "../../components/buttons/DeclineInviteButton";
import RemoveFriendButton from "@/components/buttons/RemoveFriendButton";

type ProfileHeaderProps = {
  user: User;
  friendsCount?: number;
};

async function ProfileHeader({ user, friendsCount }: ProfileHeaderProps) {
  const loggedInUser = await getUser();
  if (!loggedInUser) return null;
  const isSelf = loggedInUser.id === user.id;

  const { receivedInvites, sentInvites } = (
    await getInvites(loggedInUser.id, loggedInUser.accessToken)
  ).data;
  const yourFriends = (
    await getUserFriends(loggedInUser.id, loggedInUser.accessToken)
  ).data;

  const hasSentYouInvite = receivedInvites.some(
    (invite) => invite.sender.id === user.id
  );
  const hasBeenInvited = sentInvites.some(
    (invite) => invite.recipent.id === user.id
  );

  const isFriend = yourFriends.some((friend) => friend.id === user.id);

  const isInvitable =
    !hasSentYouInvite && !hasBeenInvited && !isFriend && !isSelf;

  const sentInviteId = sentInvites.find(
    (invite) => invite.recipent.id === user.id
  )?.id;

  const receivedInviteId = receivedInvites.find(
    (invite) => invite.sender.id === user.id
  )?.id;

  return (
    <header className="flex mb-8 gap-4">
      <Card className="p-8 flex min-w-md">
        <div className="flex space-x-4">
          <ProfileAvatar isSelf={isSelf} user={user} />

          <div className="flex flex-col justify-center items-start pl-4">
            <Typography size="2xl" className="font-bold mb-2" as="h1">
              {`${user.name} ${user.lastname}`}
            </Typography>
            <Typography size="md" className="mb-2" as="h2" color="muted">
              @{user.login}
            </Typography>
            {!!friendsCount && (
              <Typography size="md" color="muted">
                {friendsCount} friend{friendsCount !== 1 && "s"}
              </Typography>
            )}
          </div>
        </div>
      </Card>
      {!isSelf && (
        <Card className="grow h-min self-end flex gap-4">
          {isInvitable && <AddFriendButton userId={user.id} />}
          {isFriend && (
            <RemoveFriendButton yourId={loggedInUser.id} friendId={user.id}>
              Friends
            </RemoveFriendButton>
          )}
          {hasSentYouInvite && (
            <>
              <AcceptFriendButton inviteId={receivedInviteId!} />
              <DeclineInviteButton
                variant="outline"
                inviteId={receivedInviteId!}
              >
                Dismiss
              </DeclineInviteButton>
            </>
          )}
          {hasBeenInvited && (
            <DeclineInviteButton variant="outline" inviteId={sentInviteId!}>
              Invite Sent
            </DeclineInviteButton>
          )}
          <Button>Message</Button>
          <FollowButton
            initialIsFollowing={user.isFollowed}
            userId={user.id}
            key={user.isFollowed ? "followed" : "not-followed"}
          />
        </Card>
      )}
    </header>
  );
}

export default ProfileHeader;
