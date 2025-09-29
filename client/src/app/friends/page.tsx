import Typography from "@/components/ui/Typography";
import { User } from "@/types/user";
import React from "react";
import UserMiniProfile from "./UserMiniProfile";
import { getUserFriends, getInvitableUsers, getInvites } from "@/api/friends";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import AddFriendButton from "../../components/buttons/AddFriendButton";
import DeclineInviteButton from "../../components/buttons/DeclineInviteButton";
import AcceptFriendButton from "../../components/buttons/AcceptFriendButton";
import JSONDebug from "@/components/JSONDebug";

async function FriendsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const invitableUsers = await getInvitableUsers(user.accessToken);

  const invites = await getInvites(user.id, user.accessToken);

  const friends = await getUserFriends(user.id, user.accessToken);

  const { sentInvites, receivedInvites } = invites.data;

  return (
    <main className="container mx-auto">
      <pre></pre>
      <Typography size="2xl" className="font-black mb-4" as="h1">
        Friends Page
      </Typography>
      <Typography size="xl" as="h2">
        They added you as a friend:
      </Typography>
      <div className="grid grid-cols-4 gap-8 mb-8">
        {receivedInvites.map((request) => (
          <UserMiniProfile key={request.id} user={request.sender} isBody>
            <div className="flex gap-4">
              <AcceptFriendButton inviteId={request.id} />
              <DeclineInviteButton inviteId={request.id} variant="ghost">
                Decline
              </DeclineInviteButton>
            </div>
          </UserMiniProfile>
        ))}
      </div>
      <Typography size="xl" as="h2">
        You added them as a friend:
      </Typography>
      <div className="grid grid-cols-4 gap-8 mb-8">
        {sentInvites.map((request) => (
          <UserMiniProfile key={request.id} user={request.recipent} isBody>
            <div>
              <DeclineInviteButton inviteId={request.id} variant="ghost">
                Cancel Invite
              </DeclineInviteButton>
            </div>
          </UserMiniProfile>
        ))}
      </div>
      <Typography size="xl" as="h2">
        Your friends:
      </Typography>
      <div className="grid grid-cols-4 gap-8">
        {friends.data.map((user: User) => (
          <UserMiniProfile key={user.id} user={user}></UserMiniProfile>
        ))}
      </div>
      <Typography size="xl" as="h2">
        People you may know:
      </Typography>
      <div className="grid grid-cols-4 gap-8">
        {invitableUsers.data.map((user: User) => (
          <UserMiniProfile key={user.id} user={user} isBody>
            <AddFriendButton userId={user.id} />
          </UserMiniProfile>
        ))}
      </div>
    </main>
  );
}

export default FriendsPage;
