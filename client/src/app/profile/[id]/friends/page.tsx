import { getInvites, getUserFriends } from "@/api/friends";
import { getUserProfileById } from "@/api/users";
import Typography from "@/components/ui/Typography";
import VerticalTabs, {
  Tab,
  VerticalTabsButton,
  VerticalTabsButtons,
  VerticalTabsSection,
} from "@/components/ui/verticalTabs";
import { getUser } from "@/lib/getUser";
import { notFound, redirect } from "next/navigation";
import React from "react";
import UsersList from "./UsersList";
import { getFollowers } from "@/api/followers";
import UsersListWithSearch from "./UsersListWithSearch";

type Props = {
  params: Promise<{ id: string }>;
};

async function FriendsPage({ params }: Props) {
  const loggedInUser = await getUser();
  if (!loggedInUser) redirect("/auth/login");

  const { id } = await params;

  const userFriends = await getUserFriends(id, {}, loggedInUser.accessToken);
  const invites = await getInvites(loggedInUser.id, loggedInUser.accessToken);
  const { receivedInvites, sentInvites } = invites;

  const { followers, following } = await getFollowers(
    id,
    loggedInUser.accessToken,
  );
  const user = await getUserProfileById(id, loggedInUser.accessToken);

  if (!user) return notFound();

  const isSelf = loggedInUser.id === id;

  return (
    <div>
      <Typography as="h3" className="font-bold mb-4" size="xl">
        Friends
      </Typography>

      <VerticalTabs initial="friends">
        <VerticalTabsButtons>
          <VerticalTabsButton tabName="friends">Friends</VerticalTabsButton>
          {isSelf && (
            <VerticalTabsButton tabName="invites">Invites</VerticalTabsButton>
          )}
          <VerticalTabsButton tabName="followers">Followers</VerticalTabsButton>
          <VerticalTabsButton tabName="following">Following</VerticalTabsButton>
        </VerticalTabsButtons>
        <VerticalTabsSection>
          <Tab tabName="friends">
            <UsersListWithSearch
              users={userFriends.data}
              receivedInvites={receivedInvites.data}
              sentInvites={sentInvites.data}
            />
          </Tab>
          {isSelf && (
            <Tab tabName="invites">
              <UsersList
                users={receivedInvites.data.map((invite) => invite.sender)}
                receivedInvites={receivedInvites.data}
                sentInvites={sentInvites.data}
              />
            </Tab>
          )}
          <Tab tabName="followers">
            <UsersList
              users={followers.data}
              receivedInvites={receivedInvites.data}
              sentInvites={sentInvites.data}
            />
          </Tab>
          <Tab tabName="following">
            <UsersList
              users={following.data}
              receivedInvites={receivedInvites.data}
              sentInvites={sentInvites.data}
            />
          </Tab>
        </VerticalTabsSection>
      </VerticalTabs>
    </div>
  );
}

export default FriendsPage;
