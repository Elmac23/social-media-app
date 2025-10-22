import AcceptFriendButton from "@/components/buttons/AcceptFriendButton";
import DeclineInviteButton from "@/components/buttons/DeclineInviteButton";
import UserMiniProfile from "@/app/friends/UserMiniProfile";
import { Tab } from "@/components/ui/verticalTabs";
import { ReceivedFriendIvite, SentFriendInvite } from "@/types/friendRequest";
import { User } from "@/types/user";
import React from "react";
import Typography from "@/components/ui/Typography";

type UsersListProps = {
  users: User[];
  receivedInvites: ReceivedFriendIvite[];
  sentInvites: SentFriendInvite[];
};

function UsersList({ users, receivedInvites, sentInvites }: UsersListProps) {
  return (
    <div>
      {users.length === 0 && (
        <Typography color="muted">No users found...</Typography>
      )}
      {users.length > 0 && (
        <ul className="grid grid-cols-4 gap-8 items-stretch">
          {users.map((user) => {
            const receivedInvite = receivedInvites.find(
              (r) => r.sender.id === user.id
            );
            const sentInvite = sentInvites.find(
              (r) => r.recipent.id === user.id
            );

            return (
              <li key={user.id}>
                <UserMiniProfile
                  isBody={!!receivedInvite || !!sentInvite}
                  user={user}
                  className="h-full"
                >
                  {receivedInvite && (
                    <div className="flex gap-2">
                      <AcceptFriendButton inviteId={receivedInvite.id} />
                      <DeclineInviteButton variant="ghost" inviteId={user.id}>
                        Decline
                      </DeclineInviteButton>
                    </div>
                  )}
                  {sentInvite && (
                    <>
                      <DeclineInviteButton inviteId={sentInvite.id}>
                        Cancel
                      </DeclineInviteButton>
                    </>
                  )}
                </UserMiniProfile>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default UsersList;
