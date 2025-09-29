import AcceptFriendButton from "@/components/buttons/AcceptFriendButton";
import DeclineInviteButton from "@/components/buttons/DeclineInviteButton";
import UserMiniProfile from "@/app/friends/UserMiniProfile";
import { Tab } from "@/components/ui/verticalTabs";
import { ReceivedFriendIvite, SentFriendInvite } from "@/types/friendRequest";
import { User } from "@/types/user";
import React from "react";

type UsersListProps = {
  users: User[];
  receivedInvites: ReceivedFriendIvite[];
  sentInvites: SentFriendInvite[];
};

function UsersList({ users, receivedInvites, sentInvites }: UsersListProps) {
  return (
    <div>
      {users.length > 0 && (
        <ul className="grid grid-cols-4 gap-8 items-stretch">
          {users.map((user) => {
            const hasInvitedYou = receivedInvites.some(
              (r) => r.sender.id === user.id
            );
            const youHaveInvited = sentInvites.some(
              (r) => r.recipent.id === user.id
            );
            return (
              <li key={user.id}>
                <UserMiniProfile
                  isBody={hasInvitedYou || youHaveInvited}
                  user={user}
                  className="h-full"
                >
                  {hasInvitedYou && (
                    <div className="flex gap-2">
                      <AcceptFriendButton inviteId="" />
                      <DeclineInviteButton variant="ghost" inviteId={user.id}>
                        Decline
                      </DeclineInviteButton>
                    </div>
                  )}
                  {youHaveInvited && (
                    <>
                      <DeclineInviteButton inviteId={user.id}>
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
